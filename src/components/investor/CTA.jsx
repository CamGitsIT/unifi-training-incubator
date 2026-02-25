import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Heart, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTA() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <section id="cta" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Join the Mission
                    </h2>
                    <p className="text-xl text-slate-300 mb-8">
                        Whether you're an SBA loan officer evaluating our application or a friend who wants to invest, 
                        we'd love to hear from you.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all"
                    >
                        <Heart className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                        <h3 className="font-bold text-white mb-2">Invest as a Friend</h3>
                        <p className="text-slate-400 text-sm">
                            Revenue-based loans starting at $5,000. Get paid back with 10% return.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-purple-500/50 transition-all"
                    >
                        <FileText className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                        <h3 className="font-bold text-white mb-2">Review Full Docs</h3>
                        <p className="text-slate-400 text-sm">
                            Access complete business plan, financials, and SBA application materials.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-green-500/50 transition-all"
                    >
                        <Calendar className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <h3 className="font-bold text-white mb-2">Schedule a Visit</h3>
                        <p className="text-slate-400 text-sm">
                            See the Sager Lofts property and understand the vision in person.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border border-cyan-700/50 rounded-2xl p-8"
                >
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">Get in Touch</h3>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input 
                                placeholder="Your Name" 
                                required
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                            />
                            <Input 
                                type="email" 
                                placeholder="Your Email" 
                                required
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                            />
                        </div>
                        <Textarea 
                            placeholder="I'm interested in... (investing, learning more, scheduling a visit, etc.)"
                            rows={4}
                            required
                            className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                        />
                        <Button 
                            type="submit"
                            size="lg"
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold text-lg"
                            disabled={submitted}
                        >
                            {submitted ? (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Message Sent!
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </form>

                    {submitted && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-center text-green-400 text-sm"
                        >
                            Thank you! We'll be in touch soon.
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-slate-400 text-sm">
                        This is an opportunity to be part of something meaningful. Let's build freedom together.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}