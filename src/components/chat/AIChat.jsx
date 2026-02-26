import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Loader2, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [isTransferred, setIsTransferred] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && !conversation) {
            initConversation();
        }
    }, [isOpen]);

    const initConversation = async () => {
        try {
            const conv = await base44.agents.createConversation({
                agent_name: 'customer_support',
                metadata: {
                    source: 'website',
                    started_at: new Date().toISOString()
                }
            });
            setConversation(conv);
            
            // Add welcome message
            const welcomeMsg = {
                role: 'assistant',
                content: "Hi! 👋 Welcome to OverISP's UniFi Experience Center. I'm here to help you learn about our access control and intercom solutions. How can I assist you today?"
            };
            setMessages([welcomeMsg]);
        } catch (error) {
            console.error('Failed to init conversation:', error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !conversation || isLoading) return;

        const userMessage = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            await base44.agents.addMessage(conversation, userMessage);
            
            // Subscribe to get the AI response
            const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
                const latestMessages = data.messages || [];
                setMessages(latestMessages);
                
                // Check if AI wants to transfer
                const lastAIMessage = latestMessages[latestMessages.length - 1];
                if (lastAIMessage?.role === 'assistant' && lastAIMessage?.content?.includes('[TRANSFER_TO_HUMAN]')) {
                    handleTransfer(latestMessages);
                    unsubscribe();
                }
                
                setIsLoading(false);
            });

            // Cleanup after 30 seconds
            setTimeout(() => unsubscribe(), 30000);

        } catch (error) {
            console.error('Send message error:', error);
            setIsLoading(false);
        }
    };

    const handleTransfer = async (chatMessages) => {
        setIsTransferred(true);
        
        // Extract contact info from messages
        const allText = chatMessages.map(m => m.content).join(' ');
        const emailMatch = allText.match(/[\w.-]+@[\w.-]+\.\w+/);
        const phoneMatch = allText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        
        // Try to find name (simple heuristic)
        let contactName = 'Website Visitor';
        const namePattern = /(?:name is|i'm|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i;
        const nameMatch = allText.match(namePattern);
        if (nameMatch) contactName = nameMatch[1];

        try {
            // Attempt to transfer to Chatwoot
            const result = await base44.functions.invoke('transferToChatwoot', {
                conversation_id: conversation.id,
                contact_name: contactName,
                contact_email: emailMatch?.[0] || '',
                contact_phone: phoneMatch?.[0] || '',
                messages: chatMessages
            });

            if (result.data.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "✅ Great! I've connected you with our team. They'll respond shortly through this chat or via email."
                }]);
            }
        } catch (error) {
            // If transfer fails or no human available, send email summary
            console.log('Transfer failed, sending email summary instead');
            
            await base44.functions.invoke('sendChatSummary', {
                conversation_id: conversation.id,
                contact_name: contactName,
                contact_email: emailMatch?.[0] || '',
                contact_phone: phoneMatch?.[0] || '',
                messages: chatMessages
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "✅ Thanks for chatting! Our team will review your inquiry and reach out to you soon via email."
            }]);
        }
    };

    const handleClose = async () => {
        // If conversation exists and not transferred, send summary
        if (conversation && messages.length > 1 && !isTransferred) {
            const allText = messages.map(m => m.content).join(' ');
            const emailMatch = allText.match(/[\w.-]+@[\w.-]+\.\w+/);
            
            if (emailMatch) {
                try {
                    await base44.functions.invoke('sendChatSummary', {
                        conversation_id: conversation.id,
                        contact_email: emailMatch[0],
                        messages: messages
                    });
                } catch (error) {
                    console.error('Failed to send summary:', error);
                }
            }
        }
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-5 shadow-2xl transition-all hover:scale-110 group animate-bounce"
                    style={{ animationDuration: '2s' }}
                >
                    <MessageCircle className="w-7 h-7" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                    <div className="absolute -top-12 right-0 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Chat with us! 💬
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 left-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="font-semibold">OverISP Assistant</div>
                        <div className="text-xs text-blue-100">Online • Instant Reply</div>
                    </div>
                </div>
                <button onClick={handleClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex gap-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                        )}
                        <div className={cn(
                            "rounded-2xl px-4 py-2 max-w-[80%]",
                            msg.role === 'user' 
                                ? "bg-blue-600 text-white rounded-br-none" 
                                : "bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-200"
                        )}>
                            {msg.content.replace('[TRANSFER_TO_HUMAN]', '')}
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-slate-600" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-2 justify-start">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white rounded-2xl px-4 py-3 rounded-bl-none shadow-sm border border-slate-200">
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        disabled={isLoading || isTransferred}
                        className="flex-1"
                    />
                    <Button 
                        onClick={handleSend} 
                        disabled={!input.trim() || isLoading || isTransferred}
                        size="icon"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}