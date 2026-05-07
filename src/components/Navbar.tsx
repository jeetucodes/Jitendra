
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#ab-container' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        .nav-anton {
          font-family: 'Anton', sans-serif;
          letter-spacing: 0.08em;
        }
      `}</style>
      <nav 
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out",
          isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div></div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-6 h-0.5 bg-foreground my-1.5 transition-all duration-300"></div>
              <div className={cn(
                "w-6 h-0.5 bg-foreground my-1.5 transition-all duration-300",
                isMobileMenuOpen && "opacity-0"
              )}></div>
              <div className="w-6 h-0.5 bg-foreground my-1.5 transition-all duration-300"></div>
            </button>
            
            {/* Desktop navigation */}
            <ul className="hidden md:flex space-x-10">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a 
                    href={item.href}
                    className="nav-anton text-xl hover:text-[#e63333] transition-colors duration-300"
                  >
                    {item.label.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div 
          className={cn(
            "absolute top-full left-0 w-full bg-background/95 backdrop-blur-md shadow-md transition-all duration-500 transform origin-top",
            isMobileMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
          )}
        >
          <ul className="flex flex-col py-6">
            {navItems.map((item) => (
              <li key={item.href} className="py-4">
                <a 
                  href={item.href}
                  className="nav-anton block text-center text-3xl hover:text-[#e63333] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
