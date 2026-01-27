"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import Icon from "../components/media/Icon";
import { useExternalLinks } from "@/lib/content/provider";

declare global {
  interface Window {
    grecaptcha: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark";
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export default function Contact() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  // Get external links from React Context (fetched server-side in layout)
  const externalLinks = useExternalLinks();

  useEffect(() => {
    window.onRecaptchaLoad = () => {
      setRecaptchaLoaded(true);
      if (recaptchaRef.current && widgetIdRef.current === null) {
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: (token: string) => {
            setCaptchaToken(token);
            setError(null);
          },
          "expired-callback": () => {
            setCaptchaToken(null);
          },
          theme: "dark",
        });
      }
    };

    return () => {
      window.onRecaptchaLoad = undefined;
    };
  }, []);

  const handleVerify = async () => {
    if (!captchaToken) {
      setError("Please complete the captcha first");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: captchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      const decodedEmail = atob(data.data);
      setEmail(decodedEmail);
      setIsVerified(true);
    } catch (err) {
      console.error("Verification error:", err);
      setError(err instanceof Error ? err.message : "Verification failed");
      // Reset captcha on error
      if (widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
        setCaptchaToken(null);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email);
    }
  };

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`}
        async
        defer
      />

      <div className="px-6 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Contact</h1>

        <div className="space-y-6">
          <section className="bg-slate-800 border border-purple-950/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Get My Email Address
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              To protect against spam and bots, please verify you&apos;re human
              to reveal my email address.
            </p>

            {!isVerified ? (
              <div className="space-y-4">
                {/* Loading indicator - shown before captcha loads */}
                {!recaptchaLoaded && (
                  <div className="text-gray-400 text-sm mb-4">
                    Loading captcha...
                  </div>
                )}

                {/* reCAPTCHA widget container - must be empty */}
                <div
                  ref={recaptchaRef}
                  className="mb-4"
                  style={{ minHeight: "78px" }}
                />

                <button
                  onClick={handleVerify}
                  disabled={isVerifying || !captchaToken}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isVerifying || !captchaToken
                      ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                      : "bg-purple-950 text-white hover:bg-purple-900 border border-purple-800"
                  }`}
                >
                  {isVerifying ? "Verifying..." : "Reveal Email Address"}
                </button>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <p className="text-gray-500 text-xs">
                  This site is protected by reCAPTCHA and the Google{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-400"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-400"
                  >
                    Terms of Service
                  </a>{" "}
                  apply.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3">
                    <span className="text-white font-mono">{email}</span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Verification successful
                </p>
              </div>
            )}
          </section>

          <section className="bg-slate-800 border border-purple-950/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Other Ways to Connect
            </h2>
            <div className="flex flex-wrap gap-3">
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
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-purple-950 hover:border-purple-800 border border-slate-600 text-white rounded-lg transition-colors"
                >
                  <Icon icon={link.icon} variant="ui" />
                  <span>{link.title}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
