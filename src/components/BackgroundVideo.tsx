import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function BackgroundVideo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || theme !== 'dark') return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute min-w-full min-h-full object-cover opacity-[0.15] scale-110 blur-[2px]"
      >
        <source 
          src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-deep-space-34561-large.mp4" 
          type="video/mp4" 
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60" />
    </div>
  );
}
