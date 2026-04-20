import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { db, logout } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'motion/react';
import { Loader2, Settings, User, ShoppingBag, Heart, LogOut, Info, Clock, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [purchases, setPurchases] = useState<any[]>([]);
  
  // Field States
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [isAdult, setIsAdult] = useState(false);
  const [enableNsfw, setEnableNsfw] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || `user_${user.uid.substring(0, 8)}`);
          setCountry(data.country || 'Indonesia');
          setIsAdult(data.isAdult || false);
          setEnableNsfw(data.enableNsfw || false);
        } else {
          // Initialize if doesn't exist
          const initialUsername = `user_${user.uid.substring(0, 8)}`;
          setUsername(initialUsername);
          await setDoc(docRef, {
            uid: user.uid,
            email: user.email,
            username: initialUsername,
            country: 'Indonesia',
            isAdult: false,
            enableNsfw: false,
            role: 'user',
            createdAt: new Date().toISOString()
          });
        }

        // Fetch Purchases
        const q = query(
          collection(db, 'purchases'), 
          where('userId', '==', user.uid)
        );
        const purchaseSnap = await getDocs(q);
        const purchaseList = purchaseSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPurchases(purchaseList);

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        username: username,
        country: country,
        isAdult: isAdult,
        enableNsfw: enableNsfw
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 mb-12 gap-4">
          <div className="flex gap-8 relative overflow-x-auto pb-1 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'text-[#ff007f]' : 'text-muted-foreground'}`}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('shops')}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'shops' ? 'text-[#ff007f]' : 'text-muted-foreground'}`}
            >
              Shops
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'text-[#ff007f] relative' : 'text-muted-foreground'}`}
            >
              Settings
              {activeTab === 'settings' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff007f] to-[#d946ef] rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'preferences' ? 'text-[#ff007f]' : 'text-muted-foreground'}`}
            >
              Preferences
            </button>
          </div>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'history' ? 'text-[#ff007f]' : 'text-muted-foreground'}`}
          >
            Trade History
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Email Section */}
              <div className="space-y-2">
                <label className="text-xl font-black text-white">Email</label>
                <p className="text-muted-foreground font-medium">
                  {user?.email ? `${user.email.substring(0, 1)}*******${user.email.substring(user.email.indexOf('@') - 3)}` : '-'}
                </p>
              </div>

              {/* Username Section */}
              <div className="space-y-2">
                <label className="text-xl font-black text-white">User name</label>
                <p className="text-sm text-muted-foreground mb-2">Your unique user name displayed across LaPrompt</p>
                <Input 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="max-w-md h-12 bg-[#1a1a20] border-white/5 rounded-xl text-white font-medium"
                />
              </div>

              {/* Country Section */}
              <div className="space-y-2">
                <label className="text-xl font-black text-white">Country</label>
                <div className="max-w-md">
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-12 bg-[#1a1a20] border-white/5 rounded-xl text-white font-medium">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary border-white/5">
                      <SelectItem value="Indonesia">Indonesia</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Adult Confirmation */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold text-white">I confirm that I am at least 18 years old <span className="text-primary">*</span></label>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex gap-8">
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsAdult(true)}>
                    <div className={`w-5 h-5 rounded border ${isAdult ? 'bg-[#ff007f] border-[#ff007f]' : 'border-white/20'} flex items-center justify-center transition-colors`}>
                      {isAdult && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <label className="text-sm font-bold text-white cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsAdult(false)}>
                    <div className={`w-5 h-5 rounded border ${!isAdult ? 'bg-[#ff007f] border-[#ff007f]' : 'border-white/20'} flex items-center justify-center transition-colors`}>
                      {!isAdult && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <label className="text-sm font-bold text-white cursor-pointer">No</label>
                  </div>
                </div>
              </div>

              {/* NSFW Preview */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold text-white">Enable NSFW Content Preview <span className="text-primary">*</span></label>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex gap-8">
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setEnableNsfw(true)}>
                    <div className={`w-5 h-5 rounded border ${enableNsfw ? 'bg-[#ff007f] border-[#ff007f]' : 'border-white/20'} flex items-center justify-center transition-colors`}>
                      {enableNsfw && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <label className="text-sm font-bold text-white cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setEnableNsfw(false)}>
                    <div className={`w-5 h-5 rounded border ${!enableNsfw ? 'bg-[#ff007f] border-[#ff007f]' : 'border-white/20'} flex items-center justify-center transition-colors`}>
                      {!enableNsfw && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <label className="text-sm font-bold text-white cursor-pointer">No</label>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-4 pt-8">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="px-12 h-12 bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-bold rounded-lg border-none"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="px-12 h-12 bg-black border-[#ff007f] text-white hover:bg-[#ff007f]/10 font-bold rounded-lg"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white">Trade History</h2>
              {purchases.length === 0 ? (
                <div className="bg-secondary/30 rounded-2xl p-12 text-center border border-white/5">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground font-medium">Belum ada transaksi.</p>
                  <Button onClick={() => navigate('/gallery')} variant="link" className="text-primary font-bold">Ayo belanja!</Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="bg-[#1a1a20] p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="font-bold text-white text-lg">{purchase.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(purchase.purchasedAt?.toDate ? purchase.purchasedAt.toDate() : purchase.purchasedAt).toLocaleDateString()}</span>
                          <span>ID: {purchase.transactionId?.substring(0, 12)}...</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                        <span className="text-lg font-black text-primary">Rp {purchase.price?.toLocaleString()}</span>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="rounded-xl font-bold"
                          onClick={() => navigate(`/prompt/${purchase.promptId}`)}
                        >
                          Lihat Prompt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {['profile', 'shops', 'preferences'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-secondary/20 rounded-[32px] border border-white/5">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                {activeTab === 'profile' && <User className="w-8 h-8 text-muted-foreground" />}
                {activeTab === 'shops' && <ShoppingBag className="w-8 h-8 text-muted-foreground" />}
                {activeTab === 'preferences' && <Heart className="w-8 h-8 text-muted-foreground" />}
              </div>
              <h3 className="text-xl font-bold mb-2">Halaman {activeTab} sedang dalam pengembangan</h3>
              <p className="text-muted-foreground">Sabar ya bro, lagi gue rapiin.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
