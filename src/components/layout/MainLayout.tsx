import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import AIAssistantWidget from '@/components/common/AIAssistantWidget';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AIAssistantWidget />
    </div>
  );
}
