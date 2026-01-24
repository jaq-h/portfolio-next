"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../media/Icon";
import { useMenuContent } from "@/lib/content/provider";
import type { ExternalLink } from "@/lib/content/types";

export default function MenuBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Get menu content from React Context (fetched server-side in layout)
  // No loading state needed - data is always available
  const { profile, navigation, externalLinks, footer } = useMenuContent();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const renderExternalLink = (
    link: ExternalLink,
    index: number,
    compact = false,
  ) => (
    <a
      key={index}
      href={link.url}
      target={link.url.startsWith("http") ? "_blank" : undefined}
      rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
      download={link.download ? true : undefined}
      className={`inline-flex items-center gap-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white ${
        compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"
      }`}
      title={link.title}
    >
      <Icon icon={link.icon} variant="ui" />
      <span className="ml-1">{link.title}</span>
    </a>
  );

  return (
    <>
      {/* ==================== */}
      {/* MOBILE: Hamburger Menu (below md breakpoint) */}
      {/* ==================== */}
      <header className="md:hidden bg-gray-950 border-b border-gray-800">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3 min-w-0">
            <Image
              src={profile.image}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full flex-shrink-0"
            />
            <span className="font-semibold text-white truncate">
              {profile.name}
            </span>
          </div>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0 ml-2"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <Icon icon={isOpen ? "close" : "menu"} variant="ui" />
          </button>
        </div>
      </header>

      {/* Mobile Accordion Menu - in document flow, pushes content down */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-gray-900 border-b border-gray-800 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-b-0"
        }`}
      >
        <div className="px-4 py-4">
          {/* Site Navigation */}
          <nav aria-label="Main navigation">
            <ul className="space-y-1">
              {navigation.map((link, index) => {
                const isActive = pathname === link.path;
                return (
                  <li key={index}>
                    <Link
                      href={link.path}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Icon icon={link.icon} variant="ui" />
                      <span>{link.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* External Links - below nav for mobile */}
          <div
            className="mt-4 pt-4 border-t border-gray-800"
            aria-label="External links"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-3">
              Connect
            </p>
            <div className="flex flex-wrap gap-2 px-3">
              {externalLinks.map((link, index) =>
                renderExternalLink(link, index),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== */}
      {/* TABLET: Top Bar with Nav Items (md to lg breakpoint) */}
      {/* ==================== */}
      <header className="hidden md:grid md:justify-between lg:hidden bg-gray-950 border-b border-gray-800">
        <div className="flex items-center px-4 h-16 max-w-6xl mx-auto gap-2">
          {/* Left: Profile - with min-width to prevent squishing */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Image
              src={profile.image}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="font-semibold text-white whitespace-nowrap">
              {profile.name}
            </span>
          </div>

          {/* Center: Site Navigation - flexible but constrained */}
          <nav
            className="flex items-center gap-1 flex-shrink-0"
            aria-label="Main navigation"
          >
            {navigation.map((link, index) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={index}
                  href={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon icon={link.icon} variant="ui" />
                  <span>{link.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: External Links - compact with overflow handling */}
          <div
            className="flex items-center gap-1.5 flex-shrink-0"
            aria-label="External links"
          >
            {externalLinks.map((link, index) =>
              renderExternalLink(link, index, true),
            )}
          </div>
        </div>
      </header>

      {/* ==================== */}
      {/* DESKTOP: Sidebar (lg breakpoint and above) */}
      {/* ==================== */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-gray-950 border-r border-gray-800 flex-col z-50">
        {/* Personal Info Section */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex flex-col items-center text-center">
            <Image
              src={profile.image}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full mb-4"
            />
            <h1 className="text-xl font-bold text-white mb-1">
              {profile.name}
            </h1>
            <p className="text-sm text-gray-400">{profile.title}</p>
          </div>
        </div>

        {/* Site Navigation */}
        <nav className="p-4" aria-label="Main navigation">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-3">
            Navigation
          </p>
          <ul className="space-y-1">
            {navigation.map((link, index) => {
              const isActive = pathname === link.path;
              return (
                <li key={index}>
                  <Link
                    href={link.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <Icon icon={link.icon} variant="ui" />
                    <span>{link.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* External Links - positioned directly below nav with margin */}
        <div className="px-4 pb-4" aria-label="External links">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-3">
            Connect
          </p>
          <div className="space-y-1">
            {externalLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.url.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                download={link.download ? true : undefined}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
              >
                <Icon icon={link.icon} variant="ui" />
                <span>{link.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Spacer to push footer to bottom */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            {footer.copyright}
          </p>
        </div>
      </aside>
    </>
  );
}
