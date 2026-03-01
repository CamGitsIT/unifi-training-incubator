import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CTA() {
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
                    {/* Block 1: Invest as a Friend */}
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

                    {/* Block 2: Feeling Generous */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-purple-500/50 transition-all flex flex-col items-center"
                    >
                        <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                        <h3 className="font-bold text-white mb-2">Feeling Generous?</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Your help launches the flagship experience center and creates jobs that are independent businesses across Georgia.
                        </p>
                        <Button
                            onClick={() => window.open('https://donate.stripe.com/aEU8xB9kM7IL8mo5kl', '_blank')}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg"
                        >
                            Make a Donation
                        </Button>
                    </motion.div>

                    {/* Block 3: Schedule a Visit */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-green-500/50 transition-all flex flex-col items-center"
                    >
                        <Calendar className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <h3 className="font-bold text-white mb-2">Schedule a Visit</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            See the Sager Lofts property and understand the vision in person.
                        </p>
                        <Link to={createPageUrl('ScheduleMeeting')}>
                            <Button className="bg-green-700 hover:bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded-lg">
                                Schedule a Visit
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-4 text-center text-slate-400 text-sm"
                >
                    This is an opportunity to be part of something meaningful. Let's build freedom together.
                </motion.p>
            </div>
        </section>
    );
}