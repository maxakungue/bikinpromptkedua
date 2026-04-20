import { useState, useEffect } from 'react';
import { Prompt, Category } from '@/types';
import PromptCard from '@/components/PromptCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SlidersHorizontal, ArrowUp } from 'lucide-react';
import { MOCK_PROMPTS } from '@/data/prompts';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: Category[] = ['Prompt Text', 'Prompt Gambar', 'Prompt Video', 'Other'];

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync searchQuery with URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      // Clean up the URL after reading if desired, or keep it
    }
  }, [searchParams]);

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

  const filteredPrompts = MOCK_PROMPTS.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Jelajahi Prompt</h1>
          <p className="text-muted-foreground">Temukan prompt terbaik untuk karya kreatif Anda.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari prompt..." 
              className="pl-10 w-full sm:w-64 bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-border gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Button 
          variant={selectedCategory === 'All' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('All')}
          className={`rounded-full px-6 transition-all ${selectedCategory === 'All' ? 'btn-sleek' : 'border-border hover:border-primary/50'}`}
        >
          Semua
        </Button>
        {CATEGORIES.map(cat => (
          <Button 
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-6 transition-all ${selectedCategory === cat ? 'btn-sleek' : 'border-border hover:border-primary/50'}`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold mb-2">Tidak ada hasil</h3>
          <p className="text-muted-foreground">Coba ubah kata kunci atau filter pencarian Anda.</p>
        </div>
      )}

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
