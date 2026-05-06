import { getSections, updateSection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    let sections = await getSections();
    
    if (!sections || sections.length === 0) {
      const defaultSections = [
        { id: 'hero', name: 'Hero Section', is_visible: true, content: { badge: '5,000+ Verified Advocates Across India', heading: 'Find the Best Lawyer For Your Legal Battle', subheading: 'Connect with top-rated advocates in Delhi, Mumbai, Bangalore, and 100+ cities. Free consultation.' } },
        { id: 'trust-badges', name: 'Trust Badges', is_visible: true, content: { heading: 'TRUSTED BY LEGAL PROFESSIONALS & CLIENTS ACROSS INDIA' } },
        { id: 'practice-areas', name: 'Practice Areas', is_visible: true, content: { heading: 'Our Legal Specializations', subheading: 'Connecting you with specialized advocates for every legal need.' } },
        { id: 'how-it-works', name: 'How It Works', is_visible: true, content: { heading: 'How Find My Vakeel Works', subheading: 'Get legal help in 3 simple steps.' } },
        { id: 'why-choose-us', name: 'Why Choose Us', is_visible: true, content: { badge: 'WHY CHOOSE US', heading: "India's Most Trusted Legal Platform", subheading: 'With over 5,000 verified lawyers and 10,000+ successful cases, Find My Vakeel is the go-to platform for legal assistance.', feature_1_title: 'Bar Council Verified', feature_1_desc: 'Every lawyer undergoes strict verification.', feature_2_title: 'Free Consultation', feature_2_desc: 'Get 10-15 minutes free consultation.', feature_3_title: 'Pan-India Presence', feature_3_desc: 'From Supreme Court to District Courts.', stat_1_value: '5000+', stat_1_label: 'Verified Lawyers', stat_2_value: '10000+', stat_2_label: 'Cases Won', stat_3_value: '100+', stat_3_label: 'Cities Covered', stat_4_value: '98%', stat_4_label: 'Satisfied Clients' } },
        { id: 'testimonials', name: 'Testimonials', is_visible: true, content: { badge: 'TESTIMONIALS', heading: 'What Our Clients Say', t1_name: 'Rajesh Kumar', t1_location: 'Delhi', t1_text: 'Find My Vakeel connected me with an excellent criminal lawyer. The free consultation helped me understand my options.', t1_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', t2_name: 'Anita Sharma', t2_location: 'Mumbai', t2_text: 'The family lawyer I found was compassionate and professional. Got a fair settlement. Thank you!', t2_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', t3_name: 'Vikram Patel', t3_location: 'Bangalore', t3_text: 'As a business owner, I needed a corporate lawyer urgently. Find My Vakeel connected me within hours.', t3_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' } },
        { id: 'for-lawyers', name: 'For Lawyers', is_visible: true, content: { badge: 'For Legal Professionals', heading: 'Grow Your Legal Practice With Us', subheading: 'Get high-quality leads daily, build your online brand, and focus on winning cases while we handle your growth.' } },
        { id: 'about', name: 'About Us', is_visible: true, content: { badge: 'ABOUT US', heading: "Empowering India's Legal Landscape", text1: "Find My Vakeel is India's most trusted legal marketplace, connecting clients with verified advocates across 100+ cities.", text2: "Our platform features 5,000+ verified lawyers specializing in Family Law, Criminal Defense, Property, Corporate, and Civil matters. Every lawyer undergoes a strict verification process including Bar Council ID checks." } },
        { id: 'faq', name: 'FAQ Section', is_visible: true, content: { heading: 'Frequently Asked Questions' } },
        { id: 'terms', name: 'Terms and Conditions', is_visible: true, content: { heading: 'Terms and Conditions' } },
        { id: 'latest-blogs', name: 'Latest Blogs', is_visible: true, content: { badge: 'LEGAL INSIGHTS', heading: 'Latest Blogs & Articles' } },
        { id: 'contact', name: 'Contact Section', is_visible: true, content: { heading: 'Get In Touch', subheading: "We're here to help you navigate your legal journey 24/7." } },
      ];
      
      for (const sec of defaultSections) {
        await updateSection(sec.id, sec);
      }
      sections = await getSections();
    } else {
      // Check if they need re-seeding (empty content)
      let needsReseed = false;
      const defaultMap = {
        'hero': { badge: '5,000+ Verified Advocates Across India', heading: 'Find the Best Lawyer For Your Legal Battle', subheading: 'Connect with top-rated advocates in Delhi, Mumbai, Bangalore, and 100+ cities. Free consultation.' },
        'trust-badges': { heading: 'TRUSTED BY LEGAL PROFESSIONALS & CLIENTS ACROSS INDIA' },
        'practice-areas': { heading: 'Our Legal Specializations', subheading: 'Connecting you with specialized advocates for every legal need.' },
        'how-it-works': { heading: 'How Find My Vakeel Works', subheading: 'Get legal help in 3 simple steps.' },
        'why-choose-us': { badge: 'WHY CHOOSE US', heading: "India's Most Trusted Legal Platform", subheading: 'With over 5,000 verified lawyers and 10,000+ successful cases, Find My Vakeel is the go-to platform for legal assistance.', feature_1_title: 'Bar Council Verified', feature_1_desc: 'Every lawyer undergoes strict verification.', feature_2_title: 'Free Consultation', feature_2_desc: 'Get 10-15 minutes free consultation.', feature_3_title: 'Pan-India Presence', feature_3_desc: 'From Supreme Court to District Courts.', stat_1_value: '5000+', stat_1_label: 'Verified Lawyers', stat_2_value: '10000+', stat_2_label: 'Cases Won', stat_3_value: '100+', stat_3_label: 'Cities Covered', stat_4_value: '98%', stat_4_label: 'Satisfied Clients' },
        'testimonials': { badge: 'TESTIMONIALS', heading: 'What Our Clients Say', t1_name: 'Rajesh Kumar', t1_location: 'Delhi', t1_text: 'Find My Vakeel connected me with an excellent criminal lawyer. The free consultation helped me understand my options.', t1_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', t2_name: 'Anita Sharma', t2_location: 'Mumbai', t2_text: 'The family lawyer I found was compassionate and professional. Got a fair settlement. Thank you!', t2_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', t3_name: 'Vikram Patel', t3_location: 'Bangalore', t3_text: 'As a business owner, I needed a corporate lawyer urgently. Find My Vakeel connected me within hours.', t3_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
        'for-lawyers': { badge: 'For Legal Professionals', heading: 'Grow Your Legal Practice With Us', subheading: 'Get high-quality leads daily, build your online brand, and focus on winning cases while we handle your growth.' },
        'about': { badge: 'ABOUT US', heading: "Empowering India's Legal Landscape", text1: "Find My Vakeel is India's most trusted legal marketplace, connecting clients with verified advocates across 100+ cities.", text2: "Our platform features 5,000+ verified lawyers specializing in Family Law, Criminal Defense, Property, Corporate, and Civil matters. Every lawyer undergoes a strict verification process including Bar Council ID checks." },
        'faq': { heading: 'Frequently Asked Questions' },
        'terms': { heading: 'Terms and Conditions' },
        'latest-blogs': { badge: 'LEGAL INSIGHTS', heading: 'Latest Blogs & Articles' },
        'contact': { heading: 'Get In Touch', subheading: "We're here to help you navigate your legal journey 24/7." }
      };

      for (const sec of sections) {
        if (!sec.content || Object.keys(sec.content).length === 0) {
          if (defaultMap[sec.id]) {
            await updateSection(sec.id, { ...sec, content: defaultMap[sec.id] });
            needsReseed = true;
          }
        } else if (sec.id === 'why-choose-us' && !sec.content.stat_1_value) {
          // Add missing keys for why-choose-us
          await updateSection(sec.id, { ...sec, content: { ...sec.content, ...defaultMap['why-choose-us'] } });
          needsReseed = true;
        } else if (sec.id === 'testimonials' && !sec.content.t1_name) {
          // Add missing keys for testimonials
          await updateSection(sec.id, { ...sec, content: { ...sec.content, ...defaultMap['testimonials'] } });
          needsReseed = true;
        }
      }
      if (needsReseed) {
        sections = await getSections();
      }
    }
    
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
