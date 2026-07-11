'use client';
import { useState } from 'react';

export default function FaqAccordion({ faqs = [] }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden transition-colors"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.01) 100%)',
            border: `1px solid ${open === i ? 'rgba(212,175,55,.3)' : 'rgba(255,255,255,.08)'}`,
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <span className="font-bold text-white text-sm pr-4">{faq.question}</span>
            <i className={`fas fa-chevron-down text-[#d4af37] transition-transform flex-shrink-0 ${open === i ? 'rotate-180' : ''}`}></i>
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
