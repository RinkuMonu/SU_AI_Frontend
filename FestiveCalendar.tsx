function FestiveCalendar({ plan }: { plan?: DayPlan[] | null }) {
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

  const festivals = [
    { date: 5, name: "Teacher's Day", type: "occasion" },
    { date: 7, name: "Ganesh Chaturthi", type: "festival" },
    { date: 15, name: "Onam", type: "festival" },
    { date: 27, name: "World Tourism Day", type: "occasion" }
  ];

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6 bg-[#121212] rounded-3xl p-6 shadow-2xl border border-white/5">
      {/* Calendar Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {currentDate.toLocaleDateString('en-US', { month: 'long' })} <span className="text-brand-purple">{currentDate.getFullYear()}</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors bg-white/5 border border-white/10">
              <ChevronUp className="w-5 h-5 -rotate-90" />
            </button>
            <button className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors bg-white/5 border border-white/10">
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center">
          {weekDays.map(day => (
            <div key={day} className="text-white/50 font-semibold text-sm uppercase tracking-wider pb-2 border-b border-white/10">
              {day}
            </div>
          ))}
          {paddingDays.map(day => (
            <div key={padding-} className="flex items-center justify-center h-12 w-full text-sm text-white/20 font-medium">
              {prevMonthDays - paddingDays.length + day + 1}
            </div>
          ))}
          {days.map(day => {
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
            const hasPlan = plan && plan.find(p => p.day_number === day);
            const festival = festivals.find(f => f.date === day);
            
            return (
              <div key={day} className="relative flex items-center justify-center h-12 w-full group">
                <div className={
                  flex items-center justify-center h-10 w-10 rounded-xl text-sm font-semibold transition-all cursor-pointer z-10
                  
                  
                  
                }>
                  {day}
                </div>
                {festival && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-coral" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Events Side Panel */}
      <div className="w-full xl:w-72 flex-shrink-0 bg-surface-elevated rounded-2xl p-5 border border-white/5">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-brand-coral" />
          Upcoming Events
        </h3>
        <div className="space-y-4 mt-6">
          {festivals.map((fest, idx) => (
            <div key={idx} className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
              <div className={lex flex-col items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 font-bold text-lg
                
              }>
                {fest.date}
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-brand-purple transition-colors">{fest.name}</p>
                <p className="text-white/50 text-xs capitalize mt-1">{fest.type}</p>
              </div>
            </div>
          ))}
          <div className="pt-4 mt-2 border-t border-white/5">
             <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
               <Plus className="w-4 h-4" /> Add Custom Event
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
