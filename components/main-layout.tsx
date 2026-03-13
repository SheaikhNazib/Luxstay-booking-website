import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { submitLogout } from '@/app/actions';
import { getCurrentUser } from '@/lib/api';

interface MainLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export async function MainLayout({
  children,
  showFooter = true,
}: MainLayoutProps) {
  const user = await getCurrentUser();

  return (
    <div className="site-shell">
      <Navbar user={user} onLogout={submitLogout} />
      <main className="site-main">{children}</main>
      {showFooter ? <Footer /> : null}
    </div>
  );
}