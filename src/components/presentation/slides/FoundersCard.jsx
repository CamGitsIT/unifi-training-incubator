import React from 'react';

export default function FoundersCard() {
    return (
        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
            {[
                { name: 'Cameron Champion', role: 'Founder, & Principal Trainer', image: 'https://sba.overithelp.com/public/cameron-champion.png' },
                { name: 'John Shea', role: 'Strategic Operations & Outreach', image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/5d62c10c2_7A9EAD90-F0F1-49B4-ABAF-13F22710AFD7.PNG' }
            ].map((person, i) => (
                <div key={i} className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 text-center group hover:border-cyan-500/50 transition-colors">
                    <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-cyan-500/50 transition-colors">
                        <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1">{person.name}</h4>
                    <p className="text-sm text-cyan-400">{person.role}</p>
                </div>
            ))}
        </div>
    );
}