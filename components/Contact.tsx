'use client';

import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setFeedbackMessage('');

    // Client-side validations
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!cleanName) {
      setStatus('error');
      setFeedbackMessage('Please enter your name.');
      return;
    }

    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setStatus('error');
      setFeedbackMessage('Please enter a valid email address.');
      return;
    }

    if (!cleanSubject) {
      setStatus('error');
      setFeedbackMessage('Please enter a subject.');
      return;
    }

    if (!cleanMessage || cleanMessage.length < 5) {
      setStatus('error');
      setFeedbackMessage('Please enter a message (at least 5 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/api/v1/leads', {
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        source: 'website_contact_form'
      });

      if (res.data?.success || res.status === 200 || res.status === 201) {
        setStatus('success');
        setFeedbackMessage(
          res.data?.message || 'Thank you! Your message has been sent successfully. We will get back to you soon.'
        );
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatus('error');
        setFeedbackMessage(res.data?.message || 'Unable to submit your message. Please try again.');
      }
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      const serverError =
        err?.response?.data?.detail ||
        (Array.isArray(err?.response?.data?.detail)
          ? err.response.data.detail[0]?.msg
          : null) ||
        err?.response?.data?.message ||
        'Failed to send message. Please try again or email us directly at support@dhandagrow.com.';
      setStatus('error');
      setFeedbackMessage(serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="pt-6 sm:pt-8 pb-14 sm:pb-18 relative bg-white overflow-hidden border-t border-slate-100">
      {/* Soft brand gradient glows */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-100/40 via-pink-100/40 to-transparent blur-[140px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-100/40 via-indigo-100/40 to-transparent blur-[140px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-7 sm:mb-9">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED]" />
            <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] tracking-wide">
              Contact Us
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED]">Touch</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-[15px] max-w-xl mx-auto">
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-[28px] p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
            <div className="space-y-6 sm:space-y-7 relative z-10">
              
              {/* Office */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100/70 border border-orange-200/80 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-[14px] mb-0.5">Our Office</h4>
                  <p className="text-slate-600 text-[13px] leading-relaxed">
                    Sevenunique Tech Solutions Pvt Ltd<br />
                    Jaipur, Rajasthan 302017, India
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-100/70 border border-pink-200/80 flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-5 h-5 text-[#f0449b]" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-[14px] mb-0.5">Email Us</h4>
                  <a href="mailto:support@dhandagrow.com" className="text-slate-600 hover:text-pink-600 transition-colors text-[13px]">
                    support@dhandagrow.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-100/70 border border-purple-200/80 flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5 text-[#7d36fa]" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-[14px] mb-0.5">Call Us</h4>
                  <a href="tel:+918741886688" className="text-slate-600 hover:text-purple-600 transition-colors text-[13px] font-medium">
                    +91-8741886688
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100/70 border border-blue-200/80 flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-[14px] mb-0.5">Working Hours</h4>
                  <p className="text-slate-600 text-[13px]">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Connect With Us</p>
              <div className="flex items-center gap-2.5 flex-wrap">
                <a href="https://www.instagram.com/dhandagrow" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white shadow-xs hover:scale-110 hover:shadow-md transition-all" aria-label="Instagram">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61595209640733" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow-xs hover:scale-110 hover:shadow-md transition-all" aria-label="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.youtube.com/@DhandhaGrow" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-[#FF0000] flex items-center justify-center text-white shadow-xs hover:scale-110 hover:shadow-md transition-all" aria-label="YouTube">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://x.com/DhandaGrow" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-xs hover:scale-110 hover:shadow-md transition-all" aria-label="X">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                </a>
                <a href="https://in.pinterest.com/dhandhagrow/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-[#E60023] flex items-center justify-center text-white shadow-xs hover:scale-110 hover:shadow-md transition-all" aria-label="Pinterest">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.592 0 12.017 0z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic Contact Form */}
          <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-[28px] p-7 sm:p-8 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
            <form className="space-y-4 relative z-10 flex flex-col h-full" onSubmit={handleSubmit}>
              
              {/* Feedback Alert Banner */}
              {status === 'success' && (
                <div className="p-4 rounded-[14px] bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[13px] leading-relaxed">
                    <p className="font-semibold text-emerald-900">Message Sent Successfully!</p>
                    <p className="text-emerald-700 mt-0.5">{feedbackMessage}</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-[14px] bg-rose-50 border border-rose-200/80 text-rose-800 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-[13px] leading-relaxed">
                    <p className="font-semibold text-rose-900">Unable to Send Message</p>
                    <p className="text-rose-700 mt-0.5">{feedbackMessage}</p>
                  </div>
                </div>
              )}

              <div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Your Name" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-[14px] px-5 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-[#7c3aed]/15 transition-all text-[14px] disabled:opacity-60"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Your Email" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-[14px] px-5 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-[#7c3aed]/15 transition-all text-[14px] disabled:opacity-60"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Subject" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-[14px] px-5 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-[#7c3aed]/15 transition-all text-[14px] disabled:opacity-60"
                />
              </div>
              <div className="flex-1">
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Your Message" 
                  required
                  rows={5}
                  className="w-full h-full min-h-[140px] bg-slate-50 border border-slate-200 rounded-[14px] px-5 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-[#7c3aed]/15 transition-all text-[14px] resize-none disabled:opacity-60"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-2 py-4 rounded-[14px] bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] text-white font-bold hover:opacity-95 hover:shadow-lg hover:shadow-pink-500/25 active:scale-[0.99] transition-all shadow-md text-[14px] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
