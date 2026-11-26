import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden bg-[#071023]">
      <AdminSidebar />
      <div className="flex flex-col flex-1 w-0 min-w-0 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none custom-scrollbar">
          <div className="py-6 px-4 sm:px-6 md:px-8 max-w-[1600px] 2xl:max-w-[1720px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
