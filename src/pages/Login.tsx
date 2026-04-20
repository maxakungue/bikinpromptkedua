import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signInWithGoogle, signInWithMicrosoft, signInWithTwitter, auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(-1); // Go back to previous page
    } catch (error: any) {
      console.error("Login Error:", error);
      alert("Gagal masuk: Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (method: 'google' | 'microsoft' | 'twitter') => {
    try {
      if (method === 'google') await signInWithGoogle();
      if (method === 'microsoft') await signInWithMicrosoft();
      if (method === 'twitter') await signInWithTwitter();
      navigate(-1);
    } catch (error: any) {
      console.error(`${method} Login Error:`, error);
      // Memberikan pesan error yang lebih jelas agar user tahu apa yang salah (misal: domain belum di-allow)
      alert(`Gagal masuk dengan ${method}: ${error.message}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-accent-pink/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0a0a0c] border border-white/5 rounded-[32px] p-8 md:p-10 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff007f] to-[#d946ef] rounded-xl flex items-center justify-center shadow-lg shadow-accent-pink/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">BIKINPROMPT</h1>
            <p className="text-muted-foreground font-medium">Login with</p>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white/70 ml-1">Email</label>
              <Input 
                type="email" 
                placeholder="laprompt@gmail.com" 
                className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-white/70">Password</label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot your password?</button>
              </div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="bg-white/5 border-white/10 h-12 rounded-xl pr-12 focus:border-primary/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 btn-sleek text-md py-6 mt-4">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0c] px-4 text-muted-foreground font-black tracking-widest">OR</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleSocialLogin('microsoft')}
              className="h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <svg className="w-6 h-6" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleSocialLogin('twitter')}
              className="h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
          </div>

          <div className="mt-10 text-center text-sm font-bold">
            <span className="text-muted-foreground">Need an account? </span>
            <button className="text-primary hover:underline">Create</button>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Privacy Policy</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
