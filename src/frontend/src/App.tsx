import { Toaster } from '@/components/ui/sonner';
import TRSWebsite from './pages/TRSWebsite';

export default function App() {
  return (
    <>
      <TRSWebsite />
      <Toaster richColors position="top-right" />
    </>
  );
}
