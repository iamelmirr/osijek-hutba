import './globals.css';
import { LanguageProvider } from '../src/providers/LanguageProvider';
import Header from '../src/components/Header';
import LanguageModal from '../src/components/LanguageModal';

export const metadata = {
  title: 'Hutbe - Džemat Osijek',
  description: 'Khutbahs translated for the community'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Naskh+Arabic:wght@400;600&family=Noto+Sans+Bengali:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-latin">
        <LanguageProvider>
          <Header />
          <LanguageModal />
          <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}