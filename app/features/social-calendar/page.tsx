import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureExpansionSections } from '@/components/FeatureExpansionSections';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
import { Calendar as CalendarIcon, Clock, CheckCircle2, LayoutGrid, CalendarDays, Bell, ListTodo, Plus, MoreHorizontal } from 'lucide-react';

export default function SocialCalendarPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-500/20">
      <Navbar />
      
      {/* Notion-style Clean Hero */}
      <section className="pt-20 sm:pt-24 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-6 mx-auto">
          <CalendarIcon className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Social Media Calendar</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-[80px] font-extrabold mb-6 tracking-tight text-slate-900 leading-[1.05]">
          Plan a month of content. <br/>
          <span className="text-slate-400">In exactly 5 minutes.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10 font-medium max-w-2xl mx-auto">
          A visual, drag-and-drop calendar powered by AI. It suggests when to post, writes the captions, and auto-publishes to Instagram, Facebook, and LinkedIn.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button size="lg" className="h-14 px-8 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20 border-0" asChild>
            <a href="/download">Start Planning</a>
          </Button>
        </div>
      </section>

      {/* Massive Calendar UI Mockup */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col">
          {/* Calendar Header */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0 px-6 sm:px-6 bg-slate-50 border-b border-slate-100 h-auto">
             <div className="flex items-center gap-3 sm:gap-4">
                <h3 className="text-lg sm:text-xl font-bold">October 2026</h3>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                  <div className="px-2 sm:px-3 py-1 bg-slate-100 rounded text-xs sm:text-sm font-semibold">Month</div>
                  <div className="px-2 sm:px-3 py-1 text-slate-500 rounded text-xs sm:text-sm font-medium hover:bg-slate-50 cursor-pointer">Week</div>
                </div>
             </div>
             <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Button variant="outline" size="sm" className="h-8 sm:h-9 gap-2 font-semibold text-xs sm:text-sm shrink-0">
                  <LayoutGrid className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> Board View
                </Button>
                <Button size="sm" className="h-8 sm:h-9 gap-2 bg-orange-600 hover:bg-orange-500 font-semibold text-white text-xs sm:text-sm shrink-0">
                  <Plus className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> New Post
                </Button>
             </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="flex-1 bg-slate-50/50 p-3 sm:p-6 overflow-x-hidden">
            <div className="grid grid-cols-7 gap-2 sm:gap-4">
              {/* Days Header */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day} className="text-center mb-1 sm:mb-2">
                  <span className="inline sm:hidden text-[9px] font-bold text-slate-400">{'MTWTFSS'[idx]}</span>
                  <span className="hidden sm:inline text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">{day}</span>
                </div>
              ))}
              
              {/* Fake Calendar Cells */}
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className={`min-h-[80px] sm:min-h-[120px] bg-white rounded-xl border border-slate-100 p-1 sm:p-2 flex flex-col gap-1 sm:gap-2 ${i === 3 ? 'ring-2 ring-orange-500 ring-offset-2' : ''} hover:border-orange-200 transition-colors cursor-pointer group relative`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] sm:text-sm font-bold ${i === 3 ? 'text-orange-600 bg-orange-50 w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center' : 'text-slate-400'}`}>{i + 1}</span>
                    <MoreHorizontal className="w-3 sm:w-4 h-3 sm:h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Posts: colored dot on mobile, full card on tablet+ */}
                  {i === 1 && (
                    <>
                      <div className="flex sm:hidden w-2 h-2 rounded-full bg-blue-600 mx-auto mt-1" />
                      <div className="hidden sm:flex bg-blue-50 border border-blue-100 rounded-lg p-1.5 sm:p-2 flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase"><Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3" /> 10:00 AM</div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">Product Launch Carousel</span>
                      </div>
                    </>
                  )}
                  {i === 3 && (
                    <>
                      <div className="flex sm:hidden w-2 h-2 rounded-full bg-orange-500 mx-auto mt-1" />
                      <div className="hidden sm:flex bg-orange-50 border border-orange-200 rounded-lg p-1.5 sm:p-2 flex flex-col gap-1 shadow-sm">
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-orange-600 uppercase"><Bell className="w-2.5 sm:w-3 h-2.5 sm:h-3" /> 6:00 PM (Optimal)</div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2">Diwali Mega Sale Announcement Reel</span>
                      </div>
                    </>
                  )}
                  {i === 5 && (
                    <>
                      <div className="flex sm:hidden w-2 h-2 rounded-full bg-emerald-500 mx-auto mt-1" />
                      <div className="hidden sm:flex bg-emerald-50 border border-emerald-100 rounded-lg p-1.5 sm:p-2 flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-600 uppercase"><CheckCircle2 className="w-2.5 sm:w-3 h-2.5 sm:h-3" /> Published</div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">Customer Testimonial</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6 text-orange-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Optimal Post Times</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                AI analyzes your followers' activity to suggest the exact minute you should post for maximum reach and engagement.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <ListTodo className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Auto-Generated Plans</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Click "Fill my month" and the AI will populate your entire calendar with a mix of promotional, educational, and engaging posts.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Platform Sync</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Plan once, publish everywhere. Drag a post to a new date and it automatically reschedules across Instagram, Facebook, and LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Aesthetic CTA */}
      <FeatureShowcaseSection feature="social-calendar" />
      <FeatureExpansionSections feature="social-calendar" />
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Take control of your content.
          </h2>
          <Button size="lg" className="h-16 px-12 text-lg font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800" asChild>
            <a href="/download">Open Calendar</a>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
