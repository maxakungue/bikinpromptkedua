import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Prompt } from '@/types';
import { Copy, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface PromptCardProps {
  prompt: Prompt;
  key?: string;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/prompt/${prompt.id}`}>
        <Card className="card-sleek prompt-card-hover group cursor-pointer h-full border-border/50 hover:border-primary/50 transition-all duration-300">
          <div className="relative h-[180px] overflow-hidden">
            <img 
              src={prompt.imageUrl} 
              alt={prompt.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="h-8 text-xs gap-1 bg-white/20 backdrop-blur-md border-white/10 hover:bg-white/30 text-white">
                  < ExternalLink className="w-3 h-3" /> Detail
                </Button>
              </div>
            </div>
            <Badge className="absolute top-3 left-3 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] uppercase tracking-wider font-bold">
              {prompt.category}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="font-bold text-[16px] line-clamp-1 mb-1 group-hover:text-primary transition-colors tracking-tight">{prompt.title}</h3>
            <div className="flex flex-wrap gap-1 mb-3">
              {prompt.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border/50">#{tag}</span>
              ))}
            </div>
            <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20 italic">
                  {prompt.author[0]}
                </div>
                <span className="text-[11px] text-muted-foreground truncate max-w-[80px]">{prompt.author}</span>
              </div>
              <span className="text-sm font-black text-primary">{prompt.price === 'Free' ? 'FREE' : `Rp ${prompt.price.toLocaleString()}`}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
