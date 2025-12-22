import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Upcoming Events', path: '/upcoming-events' },
    { name: 'Board of Directors', path: '/board' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img
              src="https://customer-assets.emergentagent.com/job_interact-hub-1/artifacts/c0h4q5hl_interact.jpg"
              alt="Interact Club Kolhapur"
              className="h-14 w-auto"
            />
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-primary">Interact Club</div>
              <div className="text-sm text-muted-foreground">Kolhapur</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'text-primary bg-secondary'
                    : 'text-foreground hover:text-primary hover:bg-secondary/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Admin Button */}
          <div className="hidden lg:block">
            <Link to="/admin/login">
              <Button size="sm" className="btn-primary">
                Admin Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'text-primary bg-secondary'
                    : 'text-foreground hover:text-primary hover:bg-secondary/50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="block mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button size="sm" className="w-full btn-primary">
                Admin Login
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};