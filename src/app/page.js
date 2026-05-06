'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [userType, setUserType] = useState('client');
  const [activeFaq, setActiveFaq] = useState(null);
  const [step, setStep] = useState(1);
  const [posts, setPosts] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    legalIssue: '',
    message: ''
  });

  useEffect(() => {
    fetchLatestPosts();
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/sections');
      if (res.ok) {
        const data = await res.json();
        
        // If DB has no sections, we need to initialize them
        if (data.length === 0) {
          initSections();
        } else {
          setSections(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch sections:', err);
    }
  };

  const initSections = async () => {
    const defaultSections = [
      { id: 'hero', name: 'Hero Section', is_visible: true, content: {} },
      { id: 'trust-badges', name: 'Trust Badges', is_visible: true, content: {} },
      { id: 'practice-areas', name: 'Practice Areas', is_visible: true, content: {} },
      { id: 'how-it-works', name: 'How It Works', is_visible: true, content: {} },
      { id: 'why-choose-us', name: 'Why Choose Us', is_visible: true, content: {} },
      { id: 'testimonials', name: 'Testimonials', is_visible: true, content: {} },
      { id: 'for-lawyers', name: 'For Lawyers', is_visible: true, content: {} },
      { id: 'about', name: 'About Us', is_visible: true, content: {} },
      { id: 'faq', name: 'FAQ Section', is_visible: true, content: {} },
      { id: 'terms', name: 'Terms and Conditions', is_visible: true, content: {} },
      { id: 'latest-blogs', name: 'Latest Blogs', is_visible: true, content: {} },
      { id: 'contact', name: 'Contact Section', is_visible: true, content: {} },
    ];
    
    // We update them sequentially
    try {
      for (const sec of defaultSections) {
        await fetch(`/api/sections/${sec.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sec)
        });
      }
      setSections(defaultSections);
    } catch (err) {
      console.error(err);
    }
  };

  const isSectionVisible = (id) => {
    if (sections.length === 0) return true; // Show all by default while loading
    const sec = sections.find(s => s.id === id);
    return sec ? sec.is_visible : true;
  };

  const getSectionTitle = (id, defaultTitle) => {
    const sec = sections.find(s => s.id === id);
    return sec && sec.name ? sec.name : defaultTitle;
  };

  const getSectionContent = (id, key, defaultValue) => {
    const sec = sections.find(s => s.id === id);
    if (sec && sec.content && sec.content[key] !== undefined) {
      return sec.content[key];
    }
    return defaultValue;
  };

  const fetchLatestPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to fetch latest posts:', err);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.name) {
      alert("Please enter your name to continue");
      return;
    }
    if (step === 2 && (!formData.phone || !formData.city)) {
      alert("Please fill in your contact details");
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectUserType = (type) => {
    setUserType(type);
    // Smooth scroll to form
    document.getElementById('find-lawyer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const submitToWhatsApp = (e) => {
    e.preventDefault();
    const WHATSAPP_NUMBER = '918261889815';
    const { name, phone, city, legalIssue, message } = formData;

    if (!name || !phone || !city || !legalIssue) {
      alert('Please fill in all required fields.');
      return;
    }

    let whatsappMessage = `*🔔 NEW ${userType.toUpperCase()} LEAD*%0A%0A` +
      `*Name:* ${name}%0A` +
      `*Phone:* ${phone}%0A` +
      `*City:* ${city}%0A` +
      `*Legal Issue/Specialization:* ${legalIssue}%0A` +
      `*Message:* ${message || 'Not provided'}%0A%0A` +
      `─────────────────%0A` +
      `*Source:* Find My Vakeel Website`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, '_blank');
  };

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      {isSectionVisible('hero') && (
      <section id="find-lawyer" className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden bg-cover bg-center bg-fixed" style={{ 
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.6)), url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80")' 
      }}>
        <div className="container mx-auto px-4 relative z-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left" data-aos="fade-right">
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full glass-dark border border-brand-gold/40">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-brand-gold font-semibold text-sm">{getSectionContent('hero', 'badge', '5,000+ Verified Advocates Across India')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                {getSectionContent('hero', 'heading', 'Find the Best Lawyer For Your Legal Battle')}
              </h1>
              <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl mx-auto lg:mx-0">
                {getSectionContent('hero', 'subheading', 'Connect with top-rated advocates in Delhi, Mumbai, Bangalore, and 100+ cities. Free consultation.')}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <a href="https://wa.me/918261889815" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-3 shadow-lg">
                  <i className="fab fa-whatsapp text-2xl"></i>
                  <span>Chat on WhatsApp</span>
                </a>
                <a href="tel:+918261889815" className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-3 border border-white/30">
                  <i className="fas fa-phone"></i>
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="200">
              <div className="glass-hero rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-white/20 backdrop-blur-2xl bg-slate-900/40 relative overflow-hidden">
                {/* Progress Line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-gold to-yellow-200 transition-all duration-500 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                  ></div>
                </div>

                <div className="text-center mb-8 pt-4">
                  <h2 className="text-3xl font-serif font-bold text-white mb-2">
                    {step === 1 && "Start Your Consultation"}
                    {step === 2 && "Contact Details"}
                    {step === 3 && "Final Step"}
                  </h2>
                  <p className="text-slate-300 text-sm">Step {step} of 3</p>
                </div>

                <form onSubmit={submitToWhatsApp}>
                  {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div 
                          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center gap-1 ${userType === 'client' ? 'border-brand-gold bg-brand-gold/20' : 'border-slate-700 bg-slate-800/50'}`}
                          onClick={() => selectUserType('client')}
                        >
                          <i className={`fas fa-user text-2xl ${userType === 'client' ? 'text-brand-gold' : 'text-slate-500'}`}></i>
                          <p className={`font-bold text-sm ${userType === 'client' ? 'text-white' : 'text-slate-400'}`}>I'm a Client</p>
                        </div>
                        <div 
                          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center gap-1 ${userType === 'lawyer' ? 'border-brand-gold bg-brand-gold/20' : 'border-slate-700 bg-slate-800/50'}`}
                          onClick={() => selectUserType('lawyer')}
                        >
                          <i className={`fas fa-user-tie text-2xl ${userType === 'lawyer' ? 'text-brand-gold' : 'text-slate-500'}`}></i>
                          <p className={`font-bold text-sm ${userType === 'lawyer' ? 'text-white' : 'text-slate-400'}`}>I'm a Lawyer</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-white text-sm font-bold flex items-center gap-2">
                          <i className="fas fa-user text-brand-gold"></i> Full Name *
                        </label>
                        <input type="text" name="name" placeholder="Enter your full name" required className="w-full bg-slate-100 border-none rounded-xl px-5 py-4 text-brand-dark focus:ring-2 focus:ring-brand-gold outline-none placeholder:text-slate-400" value={formData.name} onChange={handleInputChange} />
                      </div>

                      <button type="button" onClick={nextStep} className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-dark py-5 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                        Continue <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-2">
                        <label className="text-white text-sm font-bold flex items-center gap-2">
                          <i className="fas fa-phone text-brand-gold"></i> Phone Number *
                        </label>
                        <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" required className="w-full bg-slate-100 border-none rounded-xl px-5 py-4 text-brand-dark focus:ring-2 focus:ring-brand-gold outline-none placeholder:text-slate-400" value={formData.phone} onChange={handleInputChange} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-white text-sm font-bold flex items-center gap-2">
                          <i className="fas fa-location-dot text-brand-gold"></i> City *
                        </label>
                        <input type="text" name="city" placeholder="Enter your city" required className="w-full bg-slate-100 border-none rounded-xl px-5 py-4 text-brand-dark focus:ring-2 focus:ring-brand-gold outline-none placeholder:text-slate-400" value={formData.city} onChange={handleInputChange} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={prevStep} className="bg-white/10 hover:bg-white/20 text-white py-5 rounded-2xl font-bold transition-all">Back</button>
                        <button type="button" onClick={nextStep} className="bg-brand-gold hover:bg-yellow-500 text-brand-dark py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                          Next <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-2">
                        <label className="text-white text-sm font-bold flex items-center gap-2">
                          <i className="fas fa-briefcase text-brand-gold"></i> Legal Issue *
                        </label>
                        <select name="legalIssue" required className="w-full bg-slate-100 border-none rounded-xl px-5 py-4 text-brand-dark focus:ring-2 focus:ring-brand-gold outline-none" value={formData.legalIssue} onChange={handleInputChange}>
                          <option value="">Select your legal issue</option>
                          <option value="Family Law & Divorce">Family Law & Divorce</option>
                          <option value="Criminal Defense">Criminal Defense</option>
                          <option value="Property & Real Estate">Property & Real Estate</option>
                          <option value="Corporate & Business">Corporate & Business</option>
                          <option value="Civil Matters">Civil Matters</option>
                          <option value="Consumer Court">Consumer Court</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-white text-sm font-bold flex items-center gap-2">
                          <i className="fas fa-comment-dots text-brand-gold"></i> Brief Message
                        </label>
                        <textarea name="message" placeholder="Briefly describe your legal issue..." className="w-full bg-slate-100 border-none rounded-xl px-5 py-4 text-brand-dark focus:ring-2 focus:ring-brand-gold outline-none h-24 resize-none placeholder:text-slate-400" value={formData.message} onChange={handleInputChange}></textarea>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 group">
                          <i className="fab fa-whatsapp text-2xl group-hover:animate-bounce"></i>
                          Send via WhatsApp
                        </button>
                        <button type="button" onClick={prevStep} className="text-slate-400 hover:text-white text-sm font-bold transition-all">Go back to edit info</button>
                      </div>
                    </div>
                  )}
                </form>

                <p className="mt-6 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <i className="fas fa-lock text-brand-gold"></i> Your information is 100% secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Trust Badges */}
      {isSectionVisible('trust-badges') && (
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-500 text-sm mb-8">{getSectionContent('trust-badges', 'heading', 'TRUSTED BY LEGAL PROFESSIONALS & CLIENTS ACROSS INDIA')}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-center opacity-60 hover:opacity-100 transition-all cursor-default group">
              <i className="fas fa-landmark text-4xl text-brand-dark group-hover:text-brand-blue"></i>
              <p className="text-xs mt-2 font-medium">Supreme Court</p>
            </div>
            <div className="text-center opacity-60 hover:opacity-100 transition-all cursor-default group">
              <i className="fas fa-balance-scale text-4xl text-brand-dark group-hover:text-brand-blue"></i>
              <p className="text-xs mt-2 font-medium">High Courts</p>
            </div>
            <div className="text-center opacity-60 hover:opacity-100 transition-all cursor-default group">
              <i className="fas fa-gavel text-4xl text-brand-dark group-hover:text-brand-blue"></i>
              <p className="text-xs mt-2 font-medium">District Courts</p>
            </div>
            <div className="text-center opacity-60 hover:opacity-100 transition-all cursor-default group">
              <i className="fas fa-shield-halved text-4xl text-brand-dark group-hover:text-brand-blue"></i>
              <p className="text-xs mt-2 font-medium">Bar Council Verified</p>
            </div>
            <div className="text-center opacity-60 hover:opacity-100 transition-all cursor-default group">
              <i className="fas fa-city text-4xl text-brand-dark group-hover:text-brand-blue"></i>
              <p className="text-xs mt-2 font-medium">100+ Cities</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Practice Areas */}
      {isSectionVisible('practice-areas') && (
      <section id="practice-areas" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">{getSectionContent('practice-areas', 'heading', 'Our Legal Specializations')}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{getSectionContent('practice-areas', 'subheading', 'Connecting you with specialized advocates for every legal need.')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Family Law", icon: "fa-users", color: "blue", desc: "Divorce, Child Custody, Maintenance", img: "https://image.qwenlm.ai/public_source/704ad41d-7329-419f-bc5a-3bd7113d50ce/1fb79aa5c-8236-4791-817a-1f8b1f448503.png" },
              { title: "Criminal Defense", icon: "fa-handcuffs", color: "red", desc: "Bail, FIR, Criminal Trials", img: "https://image.qwenlm.ai/public_source/704ad41d-7329-419f-bc5a-3bd7113d50ce/1ec9b2950-392c-494c-8d30-90afdf3bc1dc.png" },
              { title: "Property Law", icon: "fa-building-circle-check", color: "green", desc: "Rent, Sale Deed, Land Disputes", img: "https://image.qwenlm.ai/public_source/704ad41d-7329-419f-bc5a-3bd7113d50ce/147266a4d-7182-4596-80d6-7802ec24c1a0.png" },
              { title: "Corporate Law", icon: "fa-briefcase", color: "purple", desc: "Contracts, Startups, Compliance" },
              { title: "Civil Matters", icon: "fa-scale-unbalanced", color: "amber", desc: "Recovery, Injunction, Civil Suits" },
              { title: "Consumer Court", icon: "fa-cart-shopping", color: "indigo", desc: "Product Defects, Service Deficiency" }
            ].map((area, i) => (
              <div key={i} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 ease-out cursor-pointer border border-transparent hover:border-brand-gold hover:-translate-y-2 hover:scale-105" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className={`w-20 h-20 bg-${area.color || 'blue'}-50 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12`}>
                  {area.img ? (
                    <img src={area.img} alt={area.title} className="w-12 h-12 object-contain" />
                  ) : (
                    <i className={`fas ${area.icon} text-3xl text-${area.color || 'blue'}-600`}></i>
                  )}
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{area.title}</h3>
                <p className="text-slate-500 text-sm">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* How It Works */}
      {isSectionVisible('how-it-works') && (
      <section id="how-it-works" className="py-24 bg-brand-dark text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">{getSectionContent('how-it-works', 'heading', 'How Find My Vakeel Works')}</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">{getSectionContent('how-it-works', 'subheading', 'Get legal help in 3 simple steps.')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { n: "1", t: "Fill the Form", d: "Share your details and legal issue through our simple, secure form." },
              { n: "2", t: "Get Connected", d: "We'll connect you with verified lawyers on WhatsApp instantly." },
              { n: "3", t: "Free Consultation", d: "Discuss your case with the lawyer and get expert advice." }
            ].map((step, idx) => (
              <div key={idx} className="text-center group" data-aos="fade-up" data-aos-delay={idx * 200}>
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand-gold to-yellow-200 rounded-full flex items-center justify-center mb-8 border-4 border-brand-gold/30 shadow-2xl transition-transform group-hover:scale-110">
                  <span className="text-4xl font-bold text-brand-dark">{step.n}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-brand-gold">{step.t}</h3>
                <p className="text-slate-300">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Why Choose Us */}
      {isSectionVisible('why-choose-us') && (
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <span className="inline-block px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-4">
                <i className="fas fa-star mr-2"></i>{getSectionContent('why-choose-us', 'badge', 'WHY CHOOSE US')}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6 leading-tight">{getSectionContent('why-choose-us', 'heading', "India's Most Trusted Legal Platform")}</h2>
              <p className="text-slate-600 text-lg mb-8">{getSectionContent('why-choose-us', 'subheading', 'With over 5,000 verified lawyers and 10,000+ successful cases, Find My Vakeel is the go-to platform for legal assistance.')}</p>
              <div className="space-y-6">
                {[
                  { t: getSectionContent('why-choose-us', 'feature_1_title', 'Bar Council Verified'), d: getSectionContent('why-choose-us', 'feature_1_desc', 'Every lawyer undergoes strict verification.'), i: "fa-circle-check", c: "green" },
                  { t: getSectionContent('why-choose-us', 'feature_2_title', 'Free Consultation'), d: getSectionContent('why-choose-us', 'feature_2_desc', 'Get 10-15 minutes free consultation.'), i: "fa-hand-holding-dollar", c: "blue" },
                  { t: getSectionContent('why-choose-us', 'feature_3_title', 'Pan-India Presence'), d: getSectionContent('why-choose-us', 'feature_3_desc', 'From Supreme Court to District Courts.'), i: "fa-map-location-dot", c: "purple" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group cursor-default">
                    <div className={`w-12 h-12 rounded-full bg-${item.c}-100 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                      <i className={`fas ${item.i} text-${item.c}-600 text-xl`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark text-lg mb-1">{item.t}</h4>
                      <p className="text-slate-600 text-sm">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6" data-aos="fade-left">
              {[
                { i: "fa-users", v: getSectionContent('why-choose-us', 'stat_1_value', '5000+'), l: getSectionContent('why-choose-us', 'stat_1_label', 'Verified Lawyers'), c: "gold" },
                { i: "fa-gavel", v: getSectionContent('why-choose-us', 'stat_2_value', '10000+'), l: getSectionContent('why-choose-us', 'stat_2_label', 'Cases Won'), c: "blue" },
                { i: "fa-city", v: getSectionContent('why-choose-us', 'stat_3_value', '100+'), l: getSectionContent('why-choose-us', 'stat_3_label', 'Cities Covered'), c: "gold" },
                { i: "fa-smile", v: getSectionContent('why-choose-us', 'stat_4_value', '98%'), l: getSectionContent('why-choose-us', 'stat_4_label', 'Satisfied Clients'), c: "blue" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-slate-50 p-8 rounded-3xl text-center shadow-lg hover:shadow-2xl transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-105 border border-slate-100">
                  <i className={`fas ${stat.i} text-4xl text-brand-${stat.c} mb-4`}></i>
                  <p className="text-3xl font-bold text-brand-dark">{stat.v}</p>
                  <p className="text-slate-600 font-medium mt-2">{stat.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Testimonials */}
      {isSectionVisible('testimonials') && (
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-4">
              <i className="fas fa-quote-left mr-2"></i>{getSectionContent('testimonials', 'badge', 'TESTIMONIALS')}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6">{getSectionContent('testimonials', 'heading', 'What Our Clients Say')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: getSectionContent('testimonials', 't1_name', 'Rajesh Kumar'), l: getSectionContent('testimonials', 't1_location', 'Delhi'), t: getSectionContent('testimonials', 't1_text', 'Find My Vakeel connected me with an excellent criminal lawyer. The free consultation helped me understand my options.'), i: getSectionContent('testimonials', 't1_image', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150') },
              { n: getSectionContent('testimonials', 't2_name', 'Anita Sharma'), l: getSectionContent('testimonials', 't2_location', 'Mumbai'), t: getSectionContent('testimonials', 't2_text', 'The family lawyer I found was compassionate and professional. Got a fair settlement. Thank you!'), i: getSectionContent('testimonials', 't2_image', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150') },
              { n: getSectionContent('testimonials', 't3_name', 'Vikram Patel'), l: getSectionContent('testimonials', 't3_location', 'Bangalore'), t: getSectionContent('testimonials', 't3_text', 'As a business owner, I needed a corporate lawyer urgently. Find My Vakeel connected me within hours.'), i: getSectionContent('testimonials', 't3_image', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150') }
            ].map((test, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-105 border border-transparent hover:border-brand-gold" data-aos="fade-up" data-aos-delay={idx * 100}>
                <div className="flex items-center gap-1 mb-6">
                  {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star text-yellow-400"></i>)}
                </div>
                <p className="text-slate-600 mb-8 italic leading-relaxed">"{test.t}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-white">
                    <img src={test.i} className="w-full h-full object-cover" alt={test.n} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark">{test.n}</p>
                    <p className="text-slate-500 text-sm">{test.l}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* For Lawyers */}
      {isSectionVisible('for-lawyers') && (
      <section id="lawyer-join" className="bg-brand-dark overflow-hidden w-full" data-aos="fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="p-10 md:p-20 lg:p-24 xl:p-32 flex flex-col justify-center">
            <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-4">{getSectionContent('for-lawyers', 'badge', 'For Legal Professionals')}</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight">{getSectionContent('for-lawyers', 'heading', 'Grow Your Legal Practice With Us')}</h2>
            <p className="text-slate-300 mb-10 text-lg leading-relaxed">{getSectionContent('for-lawyers', 'subheading', 'Get high-quality leads daily, build your online brand, and focus on winning cases while we handle your growth.')}</p>
            <ul className="space-y-5 mb-10">
              {[
                { t: "Get Verified Leads", d: "Receive genuine client inquiries on WhatsApp." },
                { t: "Website & SEO Package", d: "Get a premium website to rank on Google." },
                { t: "Digital Branding", d: "Optimize your online presence and authority." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                    <i className="fas fa-check"></i>
                  </div>
                  <div>
                    <strong className="text-white block text-lg">{item.t}</strong>
                    <span className="text-slate-400 text-sm">{item.d}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => selectUserType('lawyer')} className="btn-gold text-brand-dark px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl">Join as Lawyer Now</button>
              <a href="https://wa.me/918261889815" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 border border-white/20">
                <i className="fab fa-whatsapp text-2xl"></i> Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="relative min-h-[400px] lg:min-h-full bg-slate-900 overflow-hidden">
            <img 
              src="https://image.qwenlm.ai/public_source/704ad41d-7329-419f-bc5a-3bd7113d50ce/1bf9cd120-6f71-4f34-a7d9-460cbb227ca1.png" 
              alt="Lawyer Growth" 
              className="absolute inset-0 w-full h-full object-cover object-center opacity-90 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-l from-brand-dark/0 via-brand-dark/20 to-brand-dark/90 lg:bg-gradient-to-l lg:from-transparent lg:via-brand-dark/10 lg:to-brand-dark"></div>
          </div>
        </div>
      </section>
      )}

      {/* About Section */}
      {isSectionVisible('about') && (
      <section id="about" className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div data-aos="fade-right">
              <span className="inline-block px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-4">
                <i className="fas fa-info-circle mr-2"></i>{getSectionContent('about', 'badge', 'ABOUT US')}
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-8">{getSectionContent('about', 'heading', "Empowering India's Legal Landscape")}</h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>{getSectionContent('about', 'text1', "Find My Vakeel is India's most trusted legal marketplace, connecting clients with verified advocates across 100+ cities.")}</p>
                <p>{getSectionContent('about', 'text2', "Our platform features 5,000+ verified lawyers specializing in Family Law, Criminal Defense, Property, Corporate, and Civil matters. Every lawyer undergoes a strict verification process including Bar Council ID checks.")}</p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {["Bar Council Verified", "100% Confidential", "Free Consultation", "Expert Advice"].map(t => (
                    <div key={t} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span className="text-sm font-bold text-brand-dark">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div data-aos="fade-left">
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-blue/10 blur-3xl rounded-full"></div>
                <div className="relative bg-gradient-to-br from-brand-blue to-brand-navy rounded-[3rem] p-10 md:p-16 text-white shadow-2xl">
                  <h3 className="text-3xl font-bold mb-8">Our Mission</h3>
                  <p className="text-xl text-slate-200 mb-12 leading-relaxed">To democratize access to legal services in India by connecting every citizen with verified, competent, and affordable legal representation.</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all">
                      <p className="text-3xl font-bold text-brand-gold mb-1">5000+</p>
                      <p className="text-sm text-slate-300 uppercase tracking-wider">Advocates</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all">
                      <p className="text-3xl font-bold text-brand-gold mb-1">100+</p>
                      <p className="text-sm text-slate-300 uppercase tracking-wider">Cities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* FAQ Section */}
      {isSectionVisible('faq') && (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6">{getSectionContent('faq', 'heading', 'Frequently Asked Questions')}</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-brand-blue to-brand-gold mx-auto rounded-full"></div>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is the consultation really free?", a: "Yes! Most lawyers on our platform offer a free initial consultation (10-15 minutes) via phone or WhatsApp to understand your case basics." },
              { q: "How do I verify if a lawyer is genuine?", a: "All lawyers on Find My Vakeel are verified. We check their Bar Council registration ID and credentials before listing them." },
              { q: "Can I find a lawyer for a specific city?", a: "Absolutely. You can filter lawyers by city to find advocates who practice in the local courts relevant to your case." },
              { q: "Is my information confidential?", a: "Yes! Your privacy is our top priority. All information shared is 100% confidential and protected with enterprise-grade security." }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-aos="fade-up" data-aos-delay={i * 100}>
                <button 
                  className="w-full px-8 py-6 text-left font-bold text-brand-dark flex justify-between items-center transition-colors hover:bg-slate-50"
                  onClick={() => toggleFaq(i)}
                >
                  <span className="pr-8">{faq.q}</span>
                  <i className={`fas fa-chevron-down transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-brand-gold' : 'text-slate-400'}`}></i>
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-8 pb-8 text-slate-600 leading-relaxed pt-2">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Terms and Conditions Section */}
      {isSectionVisible('terms') && (
      <section id="terms" className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-[3rem] p-10 md:p-20 shadow-2xl border border-slate-200" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-12 border-b pb-8">{getSectionContent('terms', 'heading', 'Terms and Conditions')}</h2>
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  { n: "1", t: "Acceptance of Terms", d: "By accessing and using Find My Vakeel, you agree to comply with our user policies and legal guidelines." },
                  { n: "2", t: "Lawyer Verification", d: "We verify Bar Council IDs, but we advise users to perform their own due diligence before hiring." },
                  { n: "3", t: "Free Consultation", d: "The free consultation is intended for case discovery only. Representation involves fees determined by the lawyer." },
                  { n: "4", t: "Privacy Policy", d: "Your details are encrypted and only shared with the selected expert to facilitate your consultation." }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="text-brand-dark font-bold text-xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold text-sm font-black">{item.n}</div>
                      {item.t}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
              <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-slate-400 text-sm italic">Last updated: October 2024</p>
                <div className="flex gap-4">
                  <i className="fas fa-shield-halved text-brand-gold text-2xl"></i>
                  <i className="fas fa-lock text-brand-gold text-2xl"></i>
                  <i className="fas fa-user-secret text-brand-gold text-2xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Latest Blogs */}
      {isSectionVisible('latest-blogs') && (
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16" data-aos="fade-up">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-brand-gold/10 text-brand-gold font-semibold text-sm mb-4">
                <i className="fas fa-newspaper mr-2"></i>{getSectionContent('latest-blogs', 'badge', 'LEGAL INSIGHTS')}
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark">{getSectionContent('latest-blogs', 'heading', 'Latest Blogs & Articles')}</h2>
            </div>
            <Link href="/blog" className="mt-8 md:mt-0 text-brand-blue font-bold hover:underline flex items-center gap-3 group">
              View All Insights <i className="fas fa-arrow-right transition-transform group-hover:translate-x-2"></i>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.length === 0 ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 rounded-[2rem] h-96 animate-pulse border border-slate-100 flex items-center justify-center">
                   <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Waiting for Insights...</p>
                </div>
              ))
            ) : (
              posts.map((blog, i) => (
                <Link href={`/blog/${blog.id}`} key={i} className="group bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 border border-slate-100" data-aos="fade-up" data-aos-delay={i * 100}>
                  <div className="relative h-72 overflow-hidden">
                    <img src={blog.image || 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800'} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-6 left-6 bg-brand-gold text-brand-dark text-[10px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest">{blog.category}</div>
                  </div>
                  <div className="p-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{blog.date}</div>
                      <div className="text-brand-blue text-[10px] font-black uppercase tracking-widest">{blog.author || 'Editorial Team'}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark mb-6 leading-tight group-hover:text-brand-blue transition-colors line-clamp-2">{blog.title}</h3>
                    <div className="flex items-center gap-3 text-brand-blue font-black text-xs uppercase tracking-widest">
                      Read Full Insight <i className="fas fa-arrow-right text-[10px]"></i>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
      )}

      {/* Contact Section */}
      {isSectionVisible('contact') && (
      <section id="contact" className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6">{getSectionContent('contact', 'heading', 'Get In Touch')}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-xl">{getSectionContent('contact', 'subheading', "We're here to help you navigate your legal journey 24/7.")}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {[
              { icon: "fas fa-phone", title: "Call Us", desc: "Speak with our experts", val: "+91 82618 89815", color: "brand-blue", href: "tel:+918261889815" },
              { icon: "fab fa-whatsapp", title: "WhatsApp", desc: "Chat with us instantly", val: "Chat on WhatsApp", color: "green-500", href: "https://wa.me/918261889815" },
              { icon: "fas fa-envelope", title: "Email", desc: "Send us your queries", val: "support@findmyvakeel.com", color: "brand-gold", href: "mailto:support@findmyvakeel.com" }
            ].map((c, i) => (
              <div key={i} className="bg-white p-12 rounded-[2.5rem] text-center hover:shadow-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 group cursor-pointer border border-slate-100" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className={`w-24 h-24 bg-${c.color}/10 rounded-full flex items-center justify-center mx-auto mb-10 transition-transform group-hover:scale-110 group-hover:rotate-12`}>
                  <i className={`${c.icon} text-4xl text-${c.color}`}></i>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4 uppercase tracking-widest">{c.title}</h3>
                <p className="text-slate-500 mb-8 font-medium text-lg">{c.desc}</p>
                <a href={c.href} className={`text-${c.color} font-black text-xl hover:underline transition-all underline-offset-8`}>{c.val}</a>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}
    </main>
  );
}
