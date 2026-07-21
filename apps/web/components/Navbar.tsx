'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Tax Calculators', href: '/calculators' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-rule bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center gap-3">
              <Image
                src="/logo.png"
                alt="CONSULTax Associates Logo"
                width={200}
                height={62}
                className="h-14 w-auto object-contain"
                priority
              />
              <span className="hidden lg:inline text-sm italic font-medium text-charcoal/60 border-l border-rule pl-3 font-body">
                We take care of your taxes
              </span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-orange ${
                    isActive
                      ? 'text-orange border-b-2 border-orange pb-1'
                      : 'text-charcoal'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="rounded-md bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange/90 transition-colors"
            >
              Request a Consultation
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-charcoal hover:bg-cloud hover:text-navy focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-rule bg-white px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive
                    ? 'bg-cloud text-orange'
                    : 'text-charcoal hover:bg-cloud hover:text-navy'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 px-3">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-md bg-orange py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-orange/90 transition-colors"
            >
              Request a Consultation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
