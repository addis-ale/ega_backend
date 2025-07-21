import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex w-full flex-col">
        <nav className="flex justify-between p-3">
          <SidebarTrigger />
          <span>see the shop</span>
        </nav>
        {children}
      </main>
    </SidebarProvider>
  );
}
