import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/auth-form';
import { MainLayout } from '@/components/main-layout';
import { getCurrentUser } from '@/lib/api';

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/');
  }

  return (
    <MainLayout showFooter={false}>
      <section className="featured-section auth-page-wrap">
        <div className="container auth-container">
          <AuthForm mode="register" />
        </div>
      </section>
    </MainLayout>
  );
}
