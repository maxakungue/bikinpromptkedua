import { Search, User, Menu, Sparkles, LayoutGrid, PlusCircle, LogOut, Sun, Moon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/components/AuthProvider';
import { signInWithGoogle, auth } from '@/lib/firebase';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  const handleLogout = () => auth.signOut();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gallery?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      // Blur the input if possible in a React-way or just let the redirect handle it
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-extrabold tracking-tighter text-gradient">bikinprompt</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className={`flex-1 max-w-xl transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Cari prompt gambar, video, dll..." 
                className="pl-10 bg-secondary border-border focus:border-primary/50 transition-all rounded-[12px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/gallery" className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <LayoutGrid className="w-4 h-4" />
              Explore
            </Link>
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              {mounted && (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
            </Button>

            <Link to="/generate">
              <Button size="sm" className="btn-sleek hidden sm:flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Sell Prompt
              </Button>
            </Link>

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-8 w-8 rounded-full" />}>
                  <img src={user.photoURL || ''} alt={user.displayName || ''} className="h-8 w-8 rounded-full object-cover border border-border" referrerPolicy="no-referrer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-secondary border-border">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <span className="text-sm font-medium">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </DropdownMenuItem>
                  <hr className="border-border" />
                  <Link to="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4 text-orange-400" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="btn-sleek hidden sm:flex">
                  Masuk
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger render={<Button size="icon" variant="ghost" className="md:hidden" />}>
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-border">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="text-gradient">bikinprompt</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-10">
                  <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Home</Link>
                  <Link to="/gallery" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Explore</Link>
                  <Link to="/generate" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">AI Optimizer</Link>
                  {user && <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Dashboard</Link>}
                  <hr className="border-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mode Tampilan</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="border-border"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                      {theme === 'dark' ? 'Light' : 'Dark'}
                    </Button>
                  </div>
                  <hr className="border-border" />
                  {!user && (
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full btn-sleek">Login</Button>
                    </Link>
                  )}
                  {user && <Button onClick={() => { handleLogout(); setIsOpen(false); }} variant="outline" className="w-full border-border">Logout</Button>}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
