import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext<any>(null);

export function Tabs({ defaultValue, children, className }: any) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: any) {
  return <div className={`flex items-center ${className || ''}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className }: any) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`${className || ''} ${isActive ? 'bg-brand-purple text-white' : 'text-white/60 hover:text-white'}`}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: any) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
}
