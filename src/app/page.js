'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [userType, setUserType] = useState('client');
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    legalIssue: '',
    message: ''
  });

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
    <main>
      {/* Hero Section */}
      <section id="find-lawyer" className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden bg-cover bg-center bg-fixed" style={{ 
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.75)), url("https://image.qwenlm.ai/public_source/704ad41d-7329-419f-bc5a-3bd7113d50ce/1bf9cd120-6f71-4f34-a7d9-460cbb227ca1.png")' 
      }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left" data-aos="fade-right">
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full glass-dark border border-brand-gold/40">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-brand-gold font-semibold text-sm">5,000+ Verified Advocates Across India</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold">Best Lawyer</span><br />
                For Your Legal Battle
              </h1>
              <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl mx-auto lg:mx-0">
                Connect with top-rated advocates in Delhi, Mumbai, Bangalore, and 100+ cities.
                <span className="text-brand-gold font-semibold ml-2">Free consultation.</span>
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
              <div className="glass-hero rounded-3xl shadow-2xl p-8 border border-white/30 backdrop-blur-xl bg-white/10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-serif font-bold text-white mb-3">Get Free Legal Consultation</h2>
                  <p className="text-slate-200 text-sm">Fill the form & we'll connect you on WhatsApp instantly!</p>
                </div>
                <form onSubmit={submitToWhatsApp}>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div 
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${userType === 'client' ? 'border-brand-blue bg-blue-500/20' : 'border-slate-600 bg-slate-800/50'}`}
                      onClick={() => selectUserType('client')}
                    >
                      <i className={`fas fa-user text-3xl mb-2 ${userType === 'client' ? 'text-brand-gold' : 'text-slate-400'}`}></i>
                      <p className={`font-semibold ${userType === 'client' ? 'text-white' : 'text-slate-300'}`}>I'm a Client</p>
                    </div>
                    <div 
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${userType === 'lawyer' ? 'border-brand-blue bg-blue-500/20' : 'border-slate-600 bg-slate-800/50'}`}
                      onClick={() => selectUserType('lawyer')}
                    >
                      <i className={`fas fa-user-tie text-3xl mb-2 ${userType === 'lawyer' ? 'text-brand-gold' : 'text-slate-400'}`}></i>
                      <p className={`font-semibold ${userType === 'lawyer' ? 'text-white' : 'text-slate-300'}`}>I'm a Lawyer</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <input type="text" name="name" placeholder="Full Name *" required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none" value={formData.name} onChange={handleInputChange} />
                    <input type="tel" name="phone" placeholder="Phone Number *" required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none" value={formData.phone} onChange={handleInputChange} />
                    <input type="text" name="city" placeholder="Your City *" required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none" value={formData.city} onChange={handleInputChange} />
                    <select name="legalIssue" required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none" value={formData.legalIssue} onChange={handleInputChange}>
                      <option value="">Select Legal Issue *</option>
                      <option value="Family Law & Divorce">Family Law & Divorce</option>
                      <option value="Criminal Defense">Criminal Defense</option>
                      <option value="Property & Real Estate">Property & Real Estate</option>
                      <option value="Corporate & Business">Corporate & Business</option>
                      <option value="Civil Matters">Civil Matters</option>
                    </select>
                    <button type="submit" className="w-full btn-gold text-brand-dark py-4 rounded-xl font-bold text-lg shadow-xl uppercase tracking-wider transition-transform active:scale-95">
                      Request Consultation Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-500 text-sm mb-8">TRUSTED BY LEGAL PROFESSIONALS & CLIENTS ACROSS INDIA</p>
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
              <i className="fas fa-users text-4xl text-brand-dark group-hover:text-brand-blue"></i>
              <p className="text-xs mt-2 font-medium">5000+ Lawyers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section id="practice-areas" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-4 tracking-wider uppercase">OUR EXPERTISE</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-dark mb-6">Explore Legal <span className="text-gradient">Expertise</span></h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-brand-blue to-brand-gold mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Family Law", icon: "fa-hand-holding-heart", color: "blue", desc: "Divorce, Custody, Alimony, Adoption" },
              { title: "Criminal Defense", icon: "fa-gavel", color: "red", desc: "Bail, FIR, Theft, Assault, NDPS" },
              { title: "Property Law", icon: "fa-building-circle-check", color: "green", desc: "Rent, Sale Deed, Land Disputes" },
              { title: "Corporate Law", icon: "fa-briefcase", color: "purple", desc: "Contracts, Startups, Compliance" }
            ].map((area, i) => (
              <div key={i} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 ease-out cursor-pointer border border-transparent hover:border-brand-gold hover:-translate-y-2 hover:scale-105" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className={`w-20 h-20 bg-${area.color}-50 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12`}>
                  <i className={`fas ${area.icon} text-3xl text-${area.color}-600`}></i>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{area.title}</h3>
                <p className="text-slate-500 text-sm mb-5">{area.desc}</p>
                <span className="text-brand-blue font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Find Lawyer <i className="fas fa-arrow-right"></i></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <span className="inline-block px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-4">WHY CHOOSE US</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6">India's Most <span className="text-gradient">Trusted</span> Legal Platform</h2>
              <p className="text-slate-600 text-lg mb-8">With over 5,000 verified lawyers and 10,000+ successful cases, Find My Vakeel has become the go-to platform for legal assistance across India.</p>
              
              <div className="space-y-6">
                {[
                  { title: "Bar Council Verified", desc: "Every lawyer undergoes strict verification.", icon: "fa-check-circle", color: "green" },
                  { title: "Free Consultation", desc: "Get 10-15 minutes free consultation.", icon: "fa-hand-holding-usd", color: "blue" },
                  { title: "Pan-India Presence", desc: "From Supreme Court to District Courts.", icon: "fa-map-marked-alt", color: "purple" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`w-12 h-12 rounded-full bg-${item.color}-100 flex items-center justify-center flex-shrink-0`}>
                      <i className={`fas ${item.icon} text-${item.color}-600 text-xl`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div data-aos="fade-left">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "5,000", label: "Verified Lawyers", icon: "fa-users", color: "text-brand-gold" },
                  { num: "10,000", label: "Cases Won", icon: "fa-gavel", color: "text-brand-blue" },
                  { num: "100", label: "Cities Covered", icon: "fa-city", color: "text-brand-gold" },
                  { num: "98%", label: "Client Satisfaction", icon: "fa-smile", color: "text-brand-blue" }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-50 p-8 rounded-2xl text-center hover:bg-white hover:shadow-xl transition-all border border-slate-100">
                    <i className={`fas ${stat.icon} text-5xl ${stat.color} mb-4`}></i>
                    <p className="text-4xl font-bold text-brand-dark">{stat.num}</p>
                    <p className="text-slate-600 font-medium mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">How Find My <span className="text-brand-gold">Vakeel</span> Works</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">Get legal help in 3 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: 1, title: "Fill the Form", desc: "Share your details and legal issue through our simple, secure form." },
              { step: 2, title: "Get Connected", desc: "We'll connect you with verified lawyers on WhatsApp instantly." },
              { step: 3, title: "Free Consultation", desc: "Discuss your case with the lawyer and get expert advice." }
            ].map((s, i) => (
              <div key={i} className="text-center group" data-aos="fade-up" data-aos-delay={i * 200}>
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand-gold to-yellow-600 rounded-full flex items-center justify-center mb-8 border-4 border-brand-gold/30 group-hover:scale-110 transition-transform">
                  <span className="text-4xl font-bold text-brand-dark">{s.step}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-brand-gold">{s.title}</h3>
                <p className="text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-4">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-dark mb-6">What Our <span className="text-gradient">Clients Say</span></h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-brand-blue to-brand-gold mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rajesh Kumar", city: "Delhi", initial: "RK", color: "from-brand-blue to-brand-navy", text: "Find My Vakeel connected me with an excellent criminal lawyer in Delhi. The free consultation helped me understand my options." },
              { name: "Anita Sharma", city: "Mumbai", initial: "AS", color: "from-pink-400 to-pink-600", text: "Going through a divorce was emotionally draining. The family lawyer I found was compassionate and professional." },
              { name: "Vikram Patel", city: "Bangalore", initial: "VP", color: "from-green-400 to-green-600", text: "As a business owner, I needed a corporate lawyer urgently. Find My Vakeel connected me within hours. Excellent service!" }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <i key={j} className="fas fa-star text-yellow-400 text-sm"></i>)}
                </div>
                <p className="text-slate-600 mb-6 italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold`}>{t.initial}</div>
                  <div>
                    <p className="font-bold text-brand-dark">{t.name}</p>
                    <p className="text-slate-500 text-sm">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Lawyers Section */}
      <section id="lawyer-join" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <span className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-2">For Legal Professionals</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6">Grow Your Legal Practice</h2>
                <p className="text-slate-600 mb-8 text-lg">Get high-quality leads daily, build your online brand, and focus on winning cases.</p>
                <ul className="space-y-4 mb-8">
                  {[
                    { t: "Get Verified Leads", d: "Receive genuine client inquiries on WhatsApp." },
                    { t: "Website & SEO Package", d: "Get a premium website to rank on Google." },
                    { t: "Google My Business", d: "Optimize your local presence." }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <i className="fas fa-check-circle text-green-500 mt-1"></i>
                      <div>
                        <strong className="text-brand-dark block">{item.t}</strong>
                        <span className="text-slate-500 text-sm">{item.d}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => selectUserType('lawyer')} className="btn-gold text-brand-dark px-8 py-4 rounded-xl font-bold text-center shadow-lg uppercase tracking-wider">Join as Lawyer Now</button>
                  <a href="https://wa.me/918261889815" className="bg-white border-2 border-brand-blue text-brand-blue hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-colors">
                    <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                  </a>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <img src="https://image.qwenlm.ai/public_source/704ad41d-7329-419f-bc5a-3bd7113d50ce/1bf9cd120-6f71-4f34-a7d9-460cbb227ca1.png" alt="Lawyer Growth" className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <span className="inline-block px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-4 uppercase tracking-widest">ABOUT US</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6">About <span className="text-gradient">Find My Vakeel</span></h2>
              <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                <p>Find My Vakeel is India's most trusted legal marketplace, connecting clients with verified advocates across 100+ cities. Founded with a mission to make legal assistance accessible and affordable for everyone.</p>
                <p>Our platform features 5,000+ verified lawyers specializing in various practice areas including Family Law, Criminal Defense, Property Law, Corporate Law, and more.</p>
                <div className="flex flex-wrap gap-6 pt-4">
                  {["Bar Council Verified", "100% Confidential", "Free Consultation"].map((tag, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span className="font-semibold text-brand-dark text-sm">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div data-aos="fade-left">
              <div className="bg-gradient-to-br from-brand-blue to-brand-navy rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                <h3 className="text-2xl font-bold mb-6 text-brand-gold">Our Mission</h3>
                <p className="mb-8 text-slate-200 text-lg">To democratize access to legal services in India by connecting every citizen with verified, competent, and affordable legal representation.</p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { n: "5000+", l: "Verified Lawyers" },
                    { n: "100+", l: "Cities Covered" },
                    { n: "10000+", l: "Cases Resolved" },
                    { n: "4.9/5", l: "Client Rating" }
                  ].map((s, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-colors">
                      <p className="text-3xl font-bold text-brand-gold mb-1">{s.n}</p>
                      <p className="text-sm text-slate-300 font-medium tracking-wide uppercase">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms and Conditions */}
      <section id="terms" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6">Terms and Conditions</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-brand-blue to-brand-gold mx-auto rounded-full"></div>
          </div>

          <div className="space-y-10" data-aos="fade-up">
            {[
              { id: 1, t: "Acceptance of Terms", c: "By accessing and using Find My Vakeel, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service." },
              { id: 2, t: "Services Provided", c: "Find My Vakeel is a legal marketplace platform that connects clients with verified lawyers. We do not provide legal advice ourselves. All legal advice is provided by independent lawyers on our platform." },
              { id: 3, t: "Lawyer Verification", c: "We verify all lawyers on our platform through Bar Council registration ID and credential checks. However, we do not guarantee the outcome of any legal case. The lawyer-client relationship is independent of our platform." },
              { id: 4, t: "Free Consultation", c: "Free initial consultation (10-15 minutes) is offered by most lawyers on our platform. Detailed legal advice and representation may involve fees as agreed between you and the lawyer." },
              { id: 5, t: "Privacy and Confidentiality", c: "We take your privacy seriously. All information shared on our platform is confidential and protected. We do not share your personal information with third parties without your consent, except as required by law." },
              { id: 6, t: "Payment Terms", c: "All fee arrangements are between you and the lawyer. Find My Vakeel may earn a commission from lawyers for successful referrals. This does not affect your fees." },
              { id: 7, t: "Limitation of Liability", c: "Find My Vakeel is not liable for any legal outcomes, advice quality, or disputes between clients and lawyers. We serve as a connecting platform only." },
              { id: 8, t: "Modifications to Terms", c: "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms." },
              { id: 9, t: "Contact Information", c: "For any questions about these terms, please contact us at support@findmyvakeel.com or +91 82618 89815." }
            ].map((item) => (
              <div key={item.id}>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{item.id}. {item.t}</h3>
                <p className="text-slate-600 leading-relaxed">{item.c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6" data-aos="fade-up">
            <div>
              <span className="text-brand-blue font-bold tracking-widest uppercase text-sm mb-2 block">LEGAL INSIGHTS</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-dark">Latest <span className="text-gradient">Articles</span></h2>
            </div>
            <Link href="/blog" className="text-brand-blue font-bold flex items-center gap-2 hover:gap-3 transition-all border-b-2 border-brand-blue/20 pb-1">
              View All Insights <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* These would ideally be fetched from the API, for now showing placeholders that match the DB structure */}
            {[
              { id: 1, title: "How to Choose the Right Divorce Lawyer", category: "Family Law", date: "Oct 24, 2024", img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800" },
              { id: 2, title: "Understanding Property Rights in India", category: "Property Law", date: "Oct 22, 2024", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" },
              { id: 3, title: "5 Steps to Take After a Civil FIR", category: "Criminal Law", date: "Oct 20, 2024", img: "https://images.unsplash.com/photo-1453948574357-74e7d1d19d8b?auto=format&fit=crop&q=80&w=800" }
            ].map((blog, i) => (
              <Link href={`/blog/${blog.id}`} key={i} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="relative h-64 overflow-hidden">
                  <img src={blog.img} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-brand-gold text-brand-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">{blog.category}</div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 text-slate-400 text-sm mb-4">
                    <i className="far fa-calendar-alt"></i>
                    <span>{blog.date}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>5 min read</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-blue transition-colors line-clamp-2 leading-tight">{blog.title}</h3>
                  <span className="text-brand-blue font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Read Full Article <i className="fas fa-arrow-right"></i></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6">Frequently Asked Questions</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-brand-blue to-brand-gold mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is the consultation really free?", a: "Yes! Most lawyers on our platform offer a free initial consultation (10-15 minutes) via phone or WhatsApp to understand your case basics." },
              { q: "How do I verify if a lawyer is genuine?", a: "All lawyers on Find My Vakeel are verified. We check their Bar Council registration ID and credentials before listing them." },
              { q: "Can I find a lawyer for a specific city?", a: "Absolutely. You can filter lawyers by city to find advocates who practice in the local courts relevant to your case." },
              { q: "What if I'm not satisfied with the lawyer?", a: "We offer multiple lawyer options. If you're not satisfied, we can connect you with another verified lawyer." }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" data-aos="fade-up" data-aos-delay={i * 100}>
                <button 
                  className="w-full px-8 py-5 text-left font-bold text-brand-dark flex justify-between items-center transition-colors hover:bg-slate-50"
                  onClick={() => toggleFaq(i)}
                >
                  <span>{faq.q}</span>
                  <i className={`fas fa-chevron-down transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`}></i>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${activeFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-slate-50/50`}>
                  <p className="px-8 pb-6 pt-2 text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6">Get In <span className="text-gradient">Touch</span></h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Have questions? We're here to help you 24/7.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { icon: "fas fa-phone", title: "Call Us", desc: "Speak with our experts", val: "+91 82618 89815", color: "brand-blue", href: "tel:+918261889815" },
              { icon: "fab fa-whatsapp", title: "WhatsApp", desc: "Chat with us instantly", val: "Chat on WhatsApp", color: "green-500", href: "https://wa.me/918261889815" },
              { icon: "fas fa-envelope", title: "Email", desc: "Send us your queries", val: "support@findmyvakeel.com", color: "brand-gold", href: "mailto:support@findmyvakeel.com" }
            ].map((c, i) => (
              <div key={i} className="bg-slate-50 p-10 rounded-3xl text-center hover:bg-white hover:shadow-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 group cursor-pointer border border-slate-100" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className={`w-20 h-20 bg-${c.color}/10 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110`}>
                  <i className={`${c.icon} text-3xl text-${c.color}`}></i>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3 uppercase tracking-wider">{c.title}</h3>
                <p className="text-slate-500 mb-6 font-medium">{c.desc}</p>
                <a href={c.href} className={`text-${c.color} font-bold text-lg hover:underline transition-all underline-offset-4`}>{c.val}</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
