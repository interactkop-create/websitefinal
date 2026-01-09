import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://customer-assets.emergentagent.com/job_interact-hub-1/artifacts/c0h4q5hl_interact.jpg"
                alt="Interact Club Kolhapur"
                className="h-12 w-auto"
              />
            </div>
            <h3 className="text-white font-semibold text-lg mb-3">Interact Club of Kolhapur</h3>
            <p className="text-sm leading-relaxed">
              Empowering youth through service, leadership, and international understanding.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/upcoming-events" className="text-sm hover:text-white transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link to="/board" className="text-sm hover:text-white transition-colors">
                  Board of Directors
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm hover:text-white transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Kolhapur, Maharashtra, India</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">president.interactkop@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm mt-6 leading-relaxed">
              Join us in making a difference in our community.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
<div className="border-t border-slate-800 mt-12 pt-8 text-center space-y-2">
  <p className="text-sm">
    © {new Date().getFullYear()} Interact Club of Kolhapur. All rights reserved.
  </p>
  <p className="text-xs text-slate-400">
    Made with ❤️ by Itr. Om Malani, International Service Director, Interact Club of Kolhapur, RI 2025–26
  </p>
</div>

      </div>
    </footer>
  );
};
