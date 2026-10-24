import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthGuard } from '@/components/layout/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ThemeProvider>
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8">
            <div className="mx-auto max-w-7xl w-full">
              {children}
            </div>
          </main>
        </div>
        <CommandPalette />
      </div>
    </ThemeProvider>
    </AuthGuard>
  );
}
