'use client';

import { useEffect } from 'react';

export default function PricingClient() {
  useEffect(() => {
    // Initialize any client-side functionality here
    // This could include animations, scroll handlers, etc.
    
    // Header scroll handler
    const handleScroll = () => {
      const header = document.querySelector('.mxd-header');
      if (window.scrollY > 10) {
        header?.classList.add('is-hidden');
      } else {
        header?.classList.remove('is-hidden');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null; // This component doesn't render anything
}