export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    // This layout just returns the page content without any wrappers
    return <>{children}</>
  }