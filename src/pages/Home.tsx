import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, TrendingUp, Zap, Image as ImageIcon, Video, ArrowUp, LayoutGrid, Gift } from 'lucide-react';
import { Prompt } from '@/types';
import PromptCard from '@/components/PromptCard';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { MOCK_PROMPTS } from '@/data/prompts';
import { Link } from 'react-router-dom';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const filteredPrompts = activeCategory === 'Semua' 
    ? MOCK_PROMPTS 
    : activeCategory === 'Prompt Gratisan'
    ? MOCK_PROMPTS.filter(p => p.price === 'Free')
    : MOCK_PROMPTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                SOLUSI PROMPT PRAKTIS<br />
                <span className="text-gradient">HASIL PUAS</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
                Capek coba-coba prompt tapi hasilnya nggak konsisten? Waktu habis, hasil belum tentu sesuai. Di sini, kamu bisa akses prompt yang sudah terbukti, jadi proses kamu jauh lebih efisien.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/gallery">
                  <Button className="btn-sleek h-14 px-8 text-lg">
                    Prompt Terbaik Hari Ini
                  </Button>
                </Link>
                <Button variant="outline" className="h-14 px-8 text-lg border-primary/30 hover:bg-primary/5">
                  Lihat Video Tutorial
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 p-8 rounded-[24px] bg-gradient-to-br from-[#ff007f] to-[#d946ef] shadow-2xl shadow-primary/40 overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                <div className="relative z-20">
                  <h2 className="text-3xl font-bold text-white mb-4">SELAMAT DATANG di bikinprompt</h2>
                  <p className="text-white/80 text-sm leading-relaxed mb-8">
                    Kumpulan prompt berkualitas untuk hasil AI yang lebih maksimal. langsung Copy-Paste Hasil Puas.
                  </p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-pink/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories / Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mb-8 sm:mb-12">
            <div className="h-[1px] w-16 bg-border hidden sm:block"></div>
            <h2 className="text-[20px] uppercase tracking-[0.2em] font-black text-muted-foreground flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              Pilih Kategori
            </h2>
            <div className="h-[1px] w-16 bg-border hidden sm:block"></div>
          </div>
          
          <div className="w-full category-grid-mobile sm:flex sm:flex-wrap gap-2 sm:gap-3 justify-center">
            {[
              { name: 'Semua', icon: Sparkles },
              { name: 'Prompt Gambar', icon: ImageIcon },
              { name: 'Prompt Text', icon: Zap },
              { name: 'Prompt Video', icon: Video },
              { name: 'Prompt Gratisan', icon: Gift },
            ].map((tab, index) => {
              const count = tab.name === 'Semua' 
                ? MOCK_PROMPTS.length 
                : tab.name === 'Prompt Gratisan'
                ? MOCK_PROMPTS.filter(p => p.price === 'Free').length
                : MOCK_PROMPTS.filter(p => p.category === tab.name).length;
              const Icon = tab.icon;
              
              return (
                <motion.button
                  key={tab.name}
                  onClick={() => setActiveCategory(tab.name)}
                  whileHover={{ scale: 1.02, translateY: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 sm:px-6 py-3 rounded-[14px] text-xs sm:text-sm font-bold border transition-all duration-300 flex items-center justify-center gap-2.5 ${
                    activeCategory === tab.name
                      ? 'bg-gradient-to-r from-[#ff007f] to-[#d946ef] border-transparent text-white shadow-xl shadow-accent-pink/25 ring-2 ring-primary/20' 
                      : 'bg-secondary/50 backdrop-blur-sm border-border text-muted-foreground hover:border-primary/30 hover:bg-secondary/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 h-4 ${activeCategory === tab.name ? 'text-white' : 'text-primary'}`} />
                  <span className="whitespace-nowrap">{tab.name}</span>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md font-black ${
                    activeCategory === tab.name ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary border border-primary/10'
                  }`}>
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Professional Mobile Grid Layout */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 640px) {
            .category-grid-mobile {
              display: grid;
              grid-template-columns: repeat(6, 1fr);
              gap: 8px;
            }
            .category-grid-mobile > button:nth-child(1),
            .category-grid-mobile > button:nth-child(2) {
              grid-column: span 3;
            }
            .category-grid-mobile > button:nth-child(3),
            .category-grid-mobile > button:nth-child(4),
            .category-grid-mobile > button:nth-child(5) {
              grid-column: span 2;
              padding-left: 4px;
              padding-right: 4px;
              font-size: 10px;
            }
            .category-grid-mobile > button:nth-child(3) svg,
            .category-grid-mobile > button:nth-child(4) svg,
            .category-grid-mobile > button:nth-child(5) svg {
              width: 12px;
              height: 12px;
            }
          }
        `}} />
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 min-h-[400px]">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <PromptCard prompt={prompt} />
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredPrompts.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              Belum ada prompt untuk kategori ini.
            </div>
          )}
        </motion.div>
      </section>

      {/* Market Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-secondary/50 border border-border rounded-[16px]">
          {[
            { label: 'Prompt Terjual', value: '12.4k+' },
            { label: 'Total Payout Kreator', value: 'Rp 2.4M' },
            { label: 'Rating Rata-rata', value: '4.8/5' },
            { label: 'Kreator Aktif', value: '850+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="block text-2xl font-bold mb-1">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            whileHover={{ scale: 1.1, translateY: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-br from-[#ff007f] to-[#d946ef] text-white rounded-full shadow-xl shadow-accent-pink/20 flex items-center justify-center border border-white/20"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
