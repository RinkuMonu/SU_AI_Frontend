import React from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-24 relative bg-[#090b14] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#f0449b]/10 blur-[150px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7d36fa]/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Get in Touch
          </h2>
          <p className="text-slate-400 text-[15px] max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-2 bg-[#111623] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-8 relative z-10">
              
              {/* Office */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1e293b] flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[14px] mb-0.5">Our Office</h4>
                  <p className="text-slate-400 text-[13px]">Indore, Madhya Pradesh, India</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1e293b] flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                  <Mail className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[14px] mb-0.5">Email Us</h4>
                  <p className="text-slate-400 text-[13px]">support@dhandagrow.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1e293b] flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[14px] mb-0.5">Call Us</h4>
                  <p className="text-slate-400 text-[13px]">+91 98765 43210</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1e293b] flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[14px] mb-0.5">Working Hours</h4>
                  <p className="text-slate-400 text-[13px]">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-10 pt-6 border-t border-white/5 relative z-10">
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/dhandagrow" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white shadow-md hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61595209640733" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow-md hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.youtube.com/@DhandhaGrow" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#FF0000] flex items-center justify-center text-white shadow-md hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://x.com/DhandaGrow" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-black border border-white/20 flex items-center justify-center text-white shadow-md hover:scale-110 hover:shadow-lg transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                </a>
                <a href="https://in.pinterest.com/dhandhagrow/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#E60023] flex items-center justify-center text-white shadow-md hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.592 0 12.017 0z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-3 bg-[#111623] border border-white/5 rounded-[24px] p-8 relative overflow-hidden">
            <form className="space-y-4 relative z-10 flex flex-col h-full">
              <div>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-transparent border border-white/10 rounded-[14px] px-5 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-[14px]"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-transparent border border-white/10 rounded-[14px] px-5 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-[14px]"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Subject" 
                  className="w-full bg-transparent border border-white/10 rounded-[14px] px-5 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-[14px]"
                />
              </div>
              <div className="flex-1">
                <textarea 
                  placeholder="Your Message" 
                  className="w-full h-full min-h-[140px] bg-transparent border border-white/10 rounded-[14px] px-5 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-[14px] resize-none"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full mt-2 py-4 rounded-[14px] bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] text-white font-bold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(240,68,155,0.2)] text-[14px]"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
