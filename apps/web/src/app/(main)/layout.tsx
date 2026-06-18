import NavContainer from "@/features/nav/containers/NavContainer";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans relative overflow-x-hidden">
      {/* Subtle brand color glow - very light opacity, surgical accent */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary-container/2 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-tertiary-container/1 blur-[120px] pointer-events-none" />

      {/* Main Shell Container */}
      <div className="flex flex-1 relative z-10">
        {/* Navigation components (Sidebar, Drawer, Bottom Nav, Modals) */}
        <NavContainer />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Child Content */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl w-full mx-auto pb-24 md:pb-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
