"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function LegalServicesPage() {
  const [categories, setCategories] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState({});
  const [servicesData, setServicesData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    Promise.all([
      fetch('/api/legal-categories').then(res => res.json()),
      fetch('/api/legal-services').then(res => res.json())
    ]).then(([fetchedCategories, fetchedServices]) => {
      const fullCategories = [{ id: 'all', label: 'All Services', icon: 'fa-th-large' }, ...(Array.isArray(fetchedCategories) ? fetchedCategories : [])];
      setCategories(fullCategories);
      
      const details = (Array.isArray(fetchedCategories) ? fetchedCategories : []).reduce((acc, cat) => {
        acc[cat.id] = {
          title: cat.label + (cat.label.includes('Services') || cat.label.includes('Matters') ? '' : ' Services'),
          description: cat.description,
          icon: cat.icon,
          bgColor: cat.bg_color || 'bg-slate-100',
          iconColor: cat.icon_color || 'text-slate-600',
          cardBgFrom: cat.card_bg_from || 'from-slate-50',
          cardBgTo: cat.card_bg_to || 'to-slate-100'
        };
        return acc;
      }, {});
      setCategoryDetails(details);
      
      const mappedServices = (Array.isArray(fetchedServices) ? fetchedServices : []).map(s => ({
        ...s,
        categoryId: s.category_id
      }));
      setServicesData(mappedServices);
      setFilteredServices(mappedServices);
    }).catch(err => console.error("Failed to load legal services data", err));
  }, []);

  const handleFilter = (categoryId) => {
    setActiveFilter(categoryId);
    filterData(categoryId, searchQuery);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterData(activeFilter, query);
  };

  const filterData = (categoryId, query) => {
    let filtered = servicesData;
    if (categoryId !== 'all') {
      filtered = filtered.filter(s => s.categoryId === categoryId);
    }
    if (query) {
      filtered = filtered.filter(s => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
    }
    setFilteredServices(filtered);
  };

  const renderServicesByCategory = () => {
    if (activeFilter === 'all' && !searchQuery) {
      return Object.keys(categoryDetails).map(catId => {
        const catServices = filteredServices.filter(s => s.categoryId === catId);
        if (catServices.length === 0) return null;
        
        const details = categoryDetails[catId];
        return (
          <section key={catId} className="category-section mb-16" id={`${catId}-law`} style={{ scrollMarginTop: '80px' }}>
            <div className="flex items-center gap-3 mb-8" data-aos="fade-up">
              <div className={`w-12 h-12 rounded-xl ${details.bgColor} flex items-center justify-center`}>
                <i className={`fas ${details.icon} ${details.iconColor} text-xl`}></i>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark">{details.title}</h2>
                <p className="text-slate-500 text-sm">{details.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {catServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} details={details} index={index} />
              ))}
            </div>
          </section>
        );
      });
    }

    // When filtered
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredServices.map((service, index) => {
          const details = categoryDetails[service.categoryId];
          return <ServiceCard key={service.id} service={service} details={details} index={index} />
        })}
        {filteredServices.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500">No legal services found matching your criteria.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 text-slate-800">
      <style dangerouslySetInnerHTML={{__html: `
        .service-card { transition: all 0.35s ease; border-left: 3px solid transparent; }
        .service-card:hover { border-left-color: #d4af37; transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .filter-btn { transition: all 0.25s ease; }
        .filter-btn.active { background: linear-gradient(135deg, #1a56db, #3b82f6); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(26,86,219,0.3); }
        .search-input:focus { box-shadow: 0 0 0 3px rgba(212,175,55,0.25); }
        .gold-gradient { background: linear-gradient(135deg, #d4af37, #f3e5ab 50%, #d4af37); background-size: 200% auto; }
        .gold-gradient:hover { background-position: right center; }
        .icon-box { transition: all 0.3s ease; }
        .service-card:hover .icon-box { transform: scale(1.1) rotate(5deg); }
      `}} />

      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-slate-200 py-3">
        <div className="container mx-auto px-4">
          <ol className="breadcrumb flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-brand-blue transition"><i className="fas fa-home"></i> Home</Link></li>
            <li><i className="fas fa-chevron-right text-xs"></i></li>
            <li className="text-brand-dark font-medium">Legal Services</li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-brand-dark text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(26,86,219,0.3) 0%, transparent 50%)" }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <nav className="breadcrumb flex justify-center gap-2 text-sm mb-6 opacity-70">
            <Link href="/" className="hover:text-brand-gold">Home</Link> <span>/</span> <span>Legal Services</span>
          </nav>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 md:mb-6" data-aos="fade-down">
            <span className="text-white">All</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold">Legal Services</span>
          </h1>
          <p className="text-slate-300 text-base md:text-xl max-w-3xl mx-auto mb-8 px-4" data-aos="fade-up" data-aos-delay="100">
            Explore 100+ legal practice areas across India. Connect with verified lawyers for Family, Criminal, Property, Corporate & more.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative" data-aos="zoom-in" data-aos-delay="200">
            <div className="flex items-center bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-2">
              <i className="fas fa-search text-brand-gold ml-4 text-lg"></i>
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search legal services... (e.g., Divorce, Bail, Property)" 
                className="search-input w-full bg-transparent border-none focus:outline-none text-white px-4 py-3 text-base md:text-lg placeholder-slate-400"
              />
              <button className="gold-gradient text-brand-dark px-6 py-3 rounded-xl font-semibold text-sm md:text-base hover:shadow-lg transition whitespace-nowrap">
                <i className="fas fa-search mr-2"></i>Search
              </button>
            </div>
            {searchQuery && <p className="text-slate-400 text-xs mt-3 text-center">Showing results for &quot;{searchQuery}&quot;</p>}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm" data-aos="fade-up" data-aos-delay="300">
            <span className="flex items-center gap-2"><i className="fas fa-check-circle text-green-400"></i> 500+ Verified Lawyers</span>
            <span className="flex items-center gap-2"><i className="fas fa-check-circle text-green-400"></i> Free Consultation</span>
            <span className="flex items-center gap-2"><i className="fas fa-check-circle text-green-400"></i> All India Coverage</span>
          </div>
        </div>
      </header>

      {/* Category Filters */}
      <section className="sticky top-0 z-50 bg-white shadow-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                className={`filter-btn whitespace-nowrap px-4 py-2 rounded-full border text-sm font-medium ${activeFilter === cat.id ? 'active' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                onClick={() => handleFilter(cat.id)}
              >
                <i className={`fas ${cat.icon} mr-1`}></i>{cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        {renderServicesByCategory()}
      </main>
    </div>
  );
}

function ServiceCard({ service, details, index }) {
  const bgFrom = details?.cardBgFrom || 'from-slate-50';
  const bgTo = details?.cardBgTo || 'to-slate-100';
  const iconColor = details?.iconColor || 'text-slate-600';

  return (
    <div 
      className="service-card bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-xl"
      data-aos="fade-up"
      data-aos-delay={(index % 4) * 50}
    >
      {service.image ? (
        <div className="mb-4 w-full h-32 rounded-xl overflow-hidden relative">
          <img src={service.image} alt={service.title} className="object-cover w-full h-full transform hover:scale-110 transition duration-500" />
        </div>
      ) : (
        <div className={`icon-box w-14 h-14 bg-gradient-to-br ${bgFrom} ${bgTo} rounded-xl flex items-center justify-center mb-4`}>
          <i className={`fas ${service.icon} ${iconColor} text-2xl`}></i>
        </div>
      )}
      <h3 className="text-lg font-bold text-brand-dark mb-2">
        <Link href={`/legal-services/${service.slug}`} className="hover:text-brand-blue transition">{service.title}</Link>
      </h3>
      <p className="text-slate-500 text-sm mb-4 leading-relaxed">{service.description}</p>
      <a href="tel:+918261889815" className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm hover:text-brand-navy transition">
        <i className="fas fa-phone"></i> Consult Lawyer
      </a>
    </div>
  );
}
