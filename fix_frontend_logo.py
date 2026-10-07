import re

file_path = r'C:\Users\PC8\Downloads\Sevenunique_AI_Frontend\SU_AI_Frontend\app\(dashboard)\website-builder\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract business name and logo from data
# Locate: if (!pages || pages.length === 0) return "<h1>No data available</h1>";
insert_pos = content.find('if (!pages || pages.length === 0) return "<h1>No data available</h1>";')
if insert_pos != -1:
    insert_str = """
    const logoUrl = data.logo?.url || null;
    const bName = data.business_name || 'MyBusiness';
    """
    content = content[:insert_pos + 72] + insert_str + content[insert_pos + 72:]

# 2. Update Navbar Logo
nav_logo_search = '<span class="text-2xl font-black text-indigo-600 tracking-tight">Food<span class="text-gray-900">Delivery</span></span>'
nav_logo_replace = '${logoUrl ? `<img src="${logoUrl}" alt="${bName}" class="h-10 w-auto" />` : `<span class="text-2xl font-black text-indigo-600 tracking-tight">${bName}</span>`}'
content = content.replace(nav_logo_search, nav_logo_replace)

# 3. Update Footer Logo
footer_logo_search = '<h3 class="text-2xl font-black mb-4">Food<span class="text-indigo-500">Delivery</span></h3>'
footer_logo_replace = '<h3 class="text-2xl font-black mb-4">${logoUrl ? `<img src="${logoUrl}" alt="${bName}" class="h-10 w-auto mb-2" />` : bName}</h3>'
content = content.replace(footer_logo_search, footer_logo_replace)

# 4. Update Footer Copyright
copyright_search = '&copy; 2026 FoodDelivery, Inc. All rights reserved.'
copyright_replace = '&copy; 2026 ${bName}, Inc. All rights reserved.'
content = content.replace(copyright_search, copyright_replace)

# 5. Update footer contact text
contact_search = 'support@fooddelivery.com'
contact_replace = 'support@${bName.toLowerCase().replace(/\s+/g, "")}.com'
content = content.replace(contact_search, contact_replace)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated page.tsx with dynamic logo and business name")
