// components/Header.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  FilePlus,
  FileText,
  User,
  Info,
  Home,
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { session, signOut } = useAuth();
  const router = useRouter();
  const menuRef = useRef<HTMLElement>(null);

  // detect clicks outside mobile nav to close it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // simple auth check; swap with real session logic
  useEffect(() => {
    setLoggedIn(!!session);
  }, [session]);

  function handleLogout() {
    signOut();
    // setLoggedIn(false);
    setMenuOpen(false);
    router.push("/");
  }

  const guestLinks = [
    { href: "/", label: "Home", Icon: Home },
    { href: "/about", label: "About", Icon: Info },
    { href: "/login", label: "Login", Icon: LogIn },
    { href: "/register", label: "Sign Up", Icon: User },
  ];

  const userLinks = [
    { href: "/letters/generate", label: "Generate", Icon: FilePlus },
    { href: "/letters", label: "My Letters", Icon: FileText },
    { href: "/profile", label: "Profile", Icon: User },
  ];

  return (
    <header className="bg-background text-white/90 border-b border-secondary">
      <div className="w-full container mx-auto max-w-[100vw] flex items-center justify-between py-5 px-5 sm:px-7 md:px-10 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://img.icons8.com/color/48/000000/artificial-intelligence.png"
            alt="AI CoverLetter Logo"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <span className="font-extrabold text-xl">
            CoverLetterAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {(isLoggedIn ? userLinks : guestLinks).map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1 text-sm hover:text-primary transition"
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm hover:text-primary transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-20"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav
          ref={menuRef}
          className="md:hidden bg-background-light border-t border-secondary"
        >
          <ul className="flex flex-col divide-y divide-secondary">
            {(isLoggedIn ? userLinks : guestLinks).map(
              ({ href, label, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 px-6 py-4 hover:bg-background transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                </li>
              )
            )}
            {isLoggedIn && (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-6 py-4 text-left hover:bg-background transition"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
