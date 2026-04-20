import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, RefreshCw, Wand2, Check } from 'lucide-react';
import { generateAIPrompt } from '@/services/gemini';
import { motion, AnimatePresence } from 'motion/react';

export default function Generator() {
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('Midjourney');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; optimizedPrompt: string; explanation: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const data = await generateAIPrompt(description, platform);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-gradient">AI Prompt Optimizer</h1>
        <p className="text-muted-foreground">Ubah ide sederhana menjadi prompt profesional yang siap digunakan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Input Side */}
        <div className="md:col-span-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pilih Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {['Midjourney', 'Sora', 'DALL-E', 'Stable Diffusion'].map((p) => (
                <Button
                  key={p}
                  variant={platform === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPlatform(p)}
                  className="text-xs"
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ide Anda</label>
            <textarea
              className="w-full h-32 bg-secondary border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none"
              placeholder="Contoh: Kucing astronot di bulan sedang makan pizza..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button 
            className="w-full btn-sleek h-12"
            onClick={handleGenerate}
            disabled={loading || !description}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            Optimalkan Prompt
          </Button>
        </div>

        {/* Result Side */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="card-sleek">
                  <CardHeader className="border-b border-border bg-secondary/50">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        {result.title}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {platform}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Optimized Prompt</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs gap-2"
                          onClick={copyToClipboard}
                        >
                          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                          {copied ? 'Tersalin' : 'Salin'}
                        </Button>
                      </div>
                      <div className="p-4 bg-background rounded-xl border border-border font-mono text-sm leading-relaxed">
                        {result.optimizedPrompt}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Penjelasan</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-2xl text-center"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Wand2 className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-bold text-muted-foreground">Belum ada hasil</h3>
                <p className="text-sm text-muted-foreground/60 max-w-xs">
                  Masukkan ide Anda di sebelah kiri dan klik tombol optimalkan untuk melihat keajaiban.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
