import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PROMPTS } from '@/data/prompts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Heart, Share2, ArrowLeft, Download, ShoppingCart, Check, Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/components/AuthProvider';
import { signInWithGoogle, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect } from 'react';

declare global {
  interface Window {
    snap: any;
  }
}

export default function PromptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  
  const promptData = MOCK_PROMPTS.find(p => p.id === id);

  useEffect(() => {
    if (user && promptData) {
      // Cek apakah prompt ini sudah dibeli user
      const q = query(
        collection(db, 'purchases'), 
        where('userId', '==', user.uid),
        where('promptId', '==', id)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setHasPurchased(!snapshot.empty);
      });

      return () => unsubscribe();
    }
  }, [user, id, promptData]);

  if (!promptData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Prompt tidak ditemukan</h2>
          <Button onClick={() => navigate('/')}>Kembali ke Beranda</Button>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(promptData.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handlePurchase = async () => {
    if (!user) {
      // Arahkan ke halaman login alih-alih pop-up langsung
      navigate('/login');
      return;
    }

    if (!promptData || promptData.price === 'Free') return;

    setIsPurchasing(true);
    try {
      // Alamat Backend AI Studio lo (Full URL buat Hybrid Setup)
      const BACKEND_URL = "https://ais-pre-mhiwvda7bjhwhojragiooy-845039376626.asia-southeast1.run.app";
      
      // 1. Panggil backend untuk buat transaksi
      const response = await fetch(`${BACKEND_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: promptData.id,
          title: promptData.title,
          price: promptData.price,
          customerName: user.displayName,
          customerEmail: user.email
        }),
      });

      // Pengecekan jika response tidak sukses
      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error("Failed to parse error JSON", e);
        }
        
        console.error("Server Error Response:", errorMessage);
        
        if (response.status === 405) {
          throw new Error(`Error 405: Backend tidak merespon POST. Klik 'Share' lagi di AI Studio agar server ter-update.`);
        }
        
        throw new Error(`${errorMessage}. Pastikan API Key Midtrans & status Production/Sandbox di Secrets sudah benar.`);
      }

      const data = await response.json();

      if (data.token) {
        // 2. Munculkan popup Midtrans Snap
        window.snap.pay(data.token, {
          onSuccess: async function(result: any) {
            console.log('success', result);
            // Simpan catatan pembelian ke Firestore
            try {
              await addDoc(collection(db, 'purchases'), {
                userId: user.uid,
                promptId: promptData.id,
                title: promptData.title,
                price: promptData.price,
                transactionId: result.transaction_id,
                purchasedAt: serverTimestamp()
              });
              alert("Pembayaran Berhasil! Prompt telah terbuka.");
            } catch (err) {
              console.error("Firestore Save Error:", err);
              alert("Pembayaran sukses tapi gagal mencatat. Hubungi admin.");
            }
          },
          onPending: function(result: any) {
            console.log('pending', result);
            alert("Menunggu pembayaran Anda.");
          },
          onError: function(result: any) {
            console.log('error', result);
            alert("Pembayaran gagal.");
          },
          onClose: function() {
            console.log('customer closed the popup without finishing the payment');
          }
        });
      } else {
        throw new Error(data.error || "Gagal mendapatkan token pembayaran");
      }
    } catch (error: any) {
      console.error("Purchase Error:", error);
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 gap-2 hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="relative aspect-square rounded-[32px] overflow-hidden border border-border shadow-2xl">
              <img 
                src={promptData.imageUrl} 
                alt={promptData.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-4 py-1 text-xs uppercase tracking-widest font-bold">
                  {promptData.category}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1 h-12 rounded-xl gap-2 font-medium">
                <Heart className="w-4 h-4" /> Favoritkan
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleShare}
                className={`flex-1 h-12 rounded-xl gap-2 font-medium transition-all duration-300 ${shareCopied ? 'bg-primary/20 text-primary border-primary/30' : 'hover:bg-secondary'}`}
              >
                {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {shareCopied ? 'Link Dicopy' : 'Bagikan'}
              </Button>
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight">{promptData.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent-pink/30 border border-border flex items-center justify-center text-xs font-bold">
                    {promptData.author[0]}
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">by <span className="text-foreground">{promptData.author}</span></span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span className="text-sm text-muted-foreground">{new Date(promptData.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {promptData.description}
              </p>
            </div>

            {/* Prompt Box */}
            <div className="relative group mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent-pink/10 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative p-6 rounded-[24px] bg-secondary/50 border border-border backdrop-blur-sm overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Main Prompt</span>
                  {(hasPurchased || promptData.price === 'Free') && (
                    <Button 
                      size="sm" 
                      variant={copied ? "default" : "secondary"} 
                      onClick={handleCopy}
                      className="h-8 gap-2 rounded-lg"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Tersalin' : 'Salin Prompt'}
                    </Button>
                  )}
                </div>
                
                <div className="relative">
                  <div className={`bg-background/50 p-4 rounded-xl border border-border/50 font-mono text-sm leading-relaxed text-foreground select-all whitespace-pre-wrap ${!(hasPurchased || promptData.price === 'Free') ? 'blur-md select-none' : ''}`}>
                    {hasPurchased || promptData.price === 'Free' ? promptData.prompt : 'This is a premium prompt designed to give you the highest quality results. Purchase to unlock the full text and start creating amazing AI art instantly.'}
                  </div>
                  
                  {!hasPurchased && promptData.price !== 'Free' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-background/20 backdrop-blur-[2px] rounded-xl border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-sm font-bold text-center mb-4">Prompt Terkunci</p>
                      <Button 
                        size="sm" 
                        className="btn-sleek h-9 px-6 text-xs font-bold"
                        onClick={() => {
                          const purchaseSection = document.getElementById('purchase-section');
                          purchaseSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Beli Prompt untuk Membuka
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase / Price Section */}
            {!hasPurchased && (
              <div id="purchase-section" className="mt-auto p-6 sm:p-8 rounded-[32px] bg-secondary border border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
                  <div className="text-center sm:text-left">
                    <span className="block text-xs text-muted-foreground mb-1 uppercase tracking-widest font-bold">Harga</span>
                    <span className="text-3xl sm:text-4xl font-black text-primary">
                      {promptData.price === 'Free' ? 'GRATIS' : `Rp ${promptData.price.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="w-full sm:flex-1">
                    <Button 
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="w-full h-14 rounded-2xl text-lg font-bold shadow-2xl shadow-accent-pink/30 gap-3 bg-gradient-to-r from-[#ff007f] to-[#d946ef] text-white hover:opacity-90 transition-opacity border-none"
                    >
                      {isPurchasing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-5 h-5" />
                      )}
                      {isPurchasing ? 'Memproses...' : 'Beli Prompt'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {hasPurchased && (
              <div className="mt-auto p-6 sm:p-8 rounded-[32px] bg-green-500/10 border border-green-500/20 relative overflow-hidden">
                <div className="flex items-center gap-4 text-green-500 font-bold">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg">Prompt sudah Anda beli</p>
                    <p className="text-sm opacity-80">Anda memiliki akses penuh ke konten ini.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="mt-8">
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Tags</span>
              <div className="flex flex-wrap gap-2">
                {promptData.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="px-3 py-1 rounded-full border-border hover:border-primary/50 transition-colors cursor-pointer capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
