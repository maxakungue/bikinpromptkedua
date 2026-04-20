import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Generator from '@/pages/Generator';
import Gallery from '@/pages/Gallery';
import PromptDetail from '@/pages/PromptDetail';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from 'next-themes';
import BackgroundVideo from '@/components/BackgroundVideo';
import ScrollToTop from '@/components/ScrollToTop';

export default function App() {
  return (
    /* @ts-ignore - ThemeProvider children type mismatch in React 19 */
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
            <BackgroundVideo />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/generate" element={<Generator />} />
                <Route path="/prompt/:id" element={<PromptDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
          
          {/* Footer */}
          <footer className="border-t border-border py-12 bg-secondary/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold tracking-tighter text-gradient">bikinprompt</span>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Tempatnya Prompt Berkualitas untuk Hasil yang Lebih Puas.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Platform</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-primary transition-colors">Midjourney</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Sora Video</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">DALL-E 3</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Stable Diffusion</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Bantuan</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Kontak Kami</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} bikinprompt. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
