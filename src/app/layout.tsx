import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { FormProvider } from '@/context/FormContext';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'National Security Career Development Program | Registration Portal',
  description: 'Official online registration portal for security professionals, civil servants, and future intelligence analysts seeking foundational, advanced or specialized education and training.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className={`${manrope.className} min-h-screen bg-slate-50 text-slate-900 font-sans antialiased`}>
        <FormProvider>
          {children}
        </FormProvider>
      </body>
    </html>
  );
}
