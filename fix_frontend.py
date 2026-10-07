import re

file_path = r'C:\Users\PC8\Downloads\Sevenunique_AI_Frontend\SU_AI_Frontend\app\(dashboard)\website-builder\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add useRef to imports
if 'useRef' not in content:
    content = content.replace('useState, useEffect } from "react";', 'useState, useEffect, useRef } from "react";')
    content = content.replace('useState, useEffect, React }', 'useState, useEffect, useRef, React }')

# 2. Add fileInputRef and handleFileChange inside WebsiteBuilder component
ref_code = """  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSend("I uploaded my logo", { action: "upload_logo", base64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };"""

content = content.replace('const messagesEndRef = useRef<HTMLDivElement>(null);', ref_code)

# 3. Update handleOptionSelect
handle_option_code = """const handleOptionSelect = (option: any, msgType?: string) => {
    if (option.action === "upload_logo") {
      fileInputRef.current?.click();
      return;
    }
    if (msgType === "template_selection") {"""

content = content.replace('const handleOptionSelect = (option: any, msgType?: string) => {\n    if (msgType === "template_selection") {', handle_option_code)

# 4. Update renderer
render_code = """<div className={`p-3 rounded-lg max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-[#7C3AED] text-white' : 'bg-white/10 text-gray-200'}`}>
                   {msg.content}
                   {msg.data?.logo_url && (
                       <img src={msg.data.logo_url} className="mt-4 w-32 h-32 object-contain rounded bg-white shadow" alt="Logo Preview" />
                   )}
                   {msg.data?.images && msg.data.images.length > 0 && (
                       <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                           {msg.data.images.map((url: string, i: number) => (
                               <div key={i} className="flex flex-col items-center gap-2">
                                   <img src={url} className="w-32 h-32 object-contain rounded bg-white shadow border-2 border-white/10" alt={`Option ${i + 1}`} />
                                   <span className="text-xs font-bold bg-[#7C3AED] px-2 py-1 rounded text-white">Logo {i + 1}</span>
                               </div>
                           ))}
                       </div>
                   )}
                 </div>"""

content = content.replace("<div className={`p-3 rounded-lg max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-[#7C3AED] text-white' : 'bg-white/10 text-gray-200'}`}>\n                   {msg.content}\n                 </div>", render_code)

# 5. Add input type="file" inside JSX
input_file_code = """<div className="w-[400px] min-w-[400px] flex flex-col border-r border-white/10 bg-[#111827] z-10 relative shadow-xl">
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/40 to-pink-900/40 flex justify-between items-center">"""

content = content.replace("""<div className="w-[400px] min-w-[400px] flex flex-col border-r border-white/10 bg-[#111827] z-10 relative shadow-xl">
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/40 to-pink-900/40 flex justify-between items-center">""", input_file_code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated page.tsx")
