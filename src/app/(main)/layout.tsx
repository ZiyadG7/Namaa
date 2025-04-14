import LeftNavBar from "./Components/LeftNavBar";
import TopNavBar from "./Components/TopNavBar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en" suppressHydrationWarning>
      // <body>
          <div className="min-h-screen flex">
            {/* Left Navigation Bar */}
            <LeftNavBar />
            {/* Main Content Area */}
            <div className="flex-1 ml-56 bg-slate-100 dark:bg-gray-900">
              {/* Top Navigation Bar */}
              <TopNavBar />
              {/* Page Content */}
              <main className="p-6 bg-b">{children}</main>
            </div>
          </div>
      // </body>
    // </html>
  );
}
