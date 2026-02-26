import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Mail, Phone, Building, Calendar, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ChatConversations() {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const queryClient = useQueryClient();

    const { data: conversations = [], isLoading } = useQuery({
        queryKey: ['chatwootConversations', statusFilter],
        queryFn: async () => {
            if (statusFilter === 'all') {
                return base44.entities.ChatwootConversation.list('-created_date');
            }
            return base44.entities.ChatwootConversation.filter({ status: statusFilter }, '-created_date');
        },
    });

    const { data: properties = [] } = useQuery({
        queryKey: ['marketData'],
        queryFn: () => base44.entities.MarketDataPoint.list(),
    });

    const updateConversation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.ChatwootConversation.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['chatwootConversations']);
            setSelectedConversation(null);
        },
    });

    const handleLinkProperty = (conversationId, propertyId) => {
        updateConversation.mutate({
            id: conversationId,
            data: { linked_property_id: propertyId }
        });
    };

    const handleUpdateNotes = (conversationId, notes) => {
        updateConversation.mutate({
            id: conversationId,
            data: { notes }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-slate-100 text-slate-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getSourceColor = (source) => {
        switch (source) {
            case 'website': return 'bg-blue-100 text-blue-800';
            case 'whatsapp': return 'bg-green-100 text-green-800';
            case 'api': return 'bg-purple-100 text-purple-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Chat Conversations</h1>
                        <p className="text-slate-600">Manage leads and inquiries from Chatwoot</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold">{conversations.length}</div>
                            <div className="text-sm text-slate-600">Total Conversations</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">
                                {conversations.filter(c => c.status === 'open').length}
                            </div>
                            <div className="text-sm text-slate-600">Open</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-yellow-600">
                                {conversations.filter(c => c.status === 'pending').length}
                            </div>
                            <div className="text-sm text-slate-600">Pending</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-slate-600">
                                {conversations.filter(c => c.linked_property_id).length}
                            </div>
                            <div className="text-sm text-slate-600">Linked to Properties</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Conversations List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Conversations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-slate-500">Loading conversations...</div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">No conversations yet</div>
                        ) : (
                            <div className="space-y-3">
                                {conversations.map((conv) => {
                                    const linkedProperty = properties.find(p => p.id === conv.linked_property_id);
                                    
                                    return (
                                        <div
                                            key={conv.id}
                                            className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                                            onClick={() => setSelectedConversation(conv)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <MessageCircle className="w-4 h-4 text-slate-400" />
                                                        <span className="font-semibold">{conv.contact_name}</span>
                                                        <Badge className={getStatusColor(conv.status)}>
                                                            {conv.status}
                                                        </Badge>
                                                        <Badge className={getSourceColor(conv.source)}>
                                                            {conv.source}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="text-sm text-slate-600 space-y-1">
                                                        {conv.contact_email && (
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="w-3 h-3" />
                                                                {conv.contact_email}
                                                            </div>
                                                        )}
                                                        {conv.contact_phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="w-3 h-3" />
                                                                {conv.contact_phone}
                                                            </div>
                                                        )}
                                                        {linkedProperty && (
                                                            <div className="flex items-center gap-2 text-blue-600">
                                                                <Building className="w-3 h-3" />
                                                                {linkedProperty.name}
                                                            </div>
                                                        )}
                                                        {conv.property_inquiry && (
                                                            <div className="mt-2 p-2 bg-slate-100 rounded text-xs italic">
                                                                {conv.property_inquiry}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="text-right text-xs text-slate-500">
                                                    <div>{conv.messages_count} messages</div>
                                                    {conv.last_message_at && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(conv.last_message_at).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Conversation Detail Dialog */}
            {selectedConversation && (
                <Dialog open={!!selectedConversation} onOpenChange={() => setSelectedConversation(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Conversation Details</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Contact</label>
                                <div className="text-lg font-semibold">{selectedConversation.contact_name}</div>
                                {selectedConversation.contact_email && (
                                    <div className="text-sm text-slate-600">{selectedConversation.contact_email}</div>
                                )}
                                {selectedConversation.contact_phone && (
                                    <div className="text-sm text-slate-600">{selectedConversation.contact_phone}</div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium">Link to Property</label>
                                <Select 
                                    value={selectedConversation.linked_property_id || ''} 
                                    onValueChange={(val) => handleLinkProperty(selectedConversation.id, val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select property..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {properties.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name} - {p.address}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Internal Notes</label>
                                <Textarea
                                    value={selectedConversation.notes || ''}
                                    onChange={(e) => {
                                        setSelectedConversation({...selectedConversation, notes: e.target.value});
                                    }}
                                    placeholder="Add internal notes..."
                                    rows={4}
                                />
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <a
                                    href={`https://doorqueens-u63843.vm.elestio.app/app/accounts/${selectedConversation.conversation_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                >
                                    View in Chatwoot <ExternalLink className="w-3 h-3" />
                                </a>
                                
                                <Button 
                                    onClick={() => handleUpdateNotes(selectedConversation.id, selectedConversation.notes)}
                                    disabled={updateConversation.isPending}
                                >
                                    Save Notes
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}