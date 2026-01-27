"use client";

import { useState, useRef, useEffect } from "react";
import { PageContainer, Card, Button } from "@/app/components/ui";
import { useExternalLinks } from "@/lib/content/provider";

declare global {
  interface Window {
    grecaptcha?: {
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
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  // Get external links from React Context (fetched server-side in layout)
  const externalLinks = useExternalLinks();

  useEffect(() => {
    const initRecaptcha = () => {
      if (
        recaptchaRef.current &&
        widgetIdRef.current === null &&
        window.grecaptcha &&
        typeof window.grecaptcha.render === "function"
      ) {
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

        // Observe the reCAPTCHA iframe to detect when it's fully rendered
        const checkRecaptchaReady = () => {
          const iframe = recaptchaRef.current?.querySelector("iframe");
          if (iframe) {
            // Wait for iframe to load its content
            iframe.addEventListener("load", () => {
              setRecaptchaReady(true);
            });
            // In case it's already loaded
            if (iframe.contentDocument?.readyState === "complete") {
              setRecaptchaReady(true);
            }
          }
        };

        // Use MutationObserver to detect when iframe is added
        const observer = new MutationObserver(() => {
          const iframe = recaptchaRef.current?.querySelector("iframe");
          if (iframe) {
            observer.disconnect();
            iframe.addEventListener("load", () => {
              setRecaptchaReady(true);
            });
            // Fallback: set ready after a short delay if load event doesn't fire
            setTimeout(() => setRecaptchaReady(true), 1000);
          }
        });

        if (recaptchaRef.current) {
          observer.observe(recaptchaRef.current, {
            childList: true,
            subtree: true,
          });
          // Also check immediately in case iframe is already there
          checkRecaptchaReady();
        }
      }
    };

    // Check if grecaptcha is already fully loaded (script preloaded in layout)
    if (
      typeof window.grecaptcha !== "undefined" &&
      typeof window.grecaptcha.render === "function"
    ) {
      initRecaptcha();
    } else {
      // Set up callback for when script finishes loading
      window.onRecaptchaLoad = () => {
        initRecaptcha();
      };
      // Also poll in case the callback was already called before we set it
      const pollInterval = setInterval(() => {
        if (
          typeof window.grecaptcha !== "undefined" &&
          typeof window.grecaptcha.render === "function"
        ) {
          clearInterval(pollInterval);
          initRecaptcha();
        }
      }, 100);
      // Clean up polling after 10 seconds
      setTimeout(() => clearInterval(pollInterval), 10000);
    }

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
      if (widgetIdRef.current !== null && window.grecaptcha) {
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
    <PageContainer title="Contact">
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">
          Get My Email Address
        </h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          To protect against spam and bots, please verify you&apos;re human to
          reveal my email address.
        </p>

        {!isVerified ? (
          <div className="space-y-4">
            {/* Skeleton loader - shown until captcha iframe is fully ready */}
            {!recaptchaReady && (
              <div className="mb-4 w-[304px] h-[78px] bg-slate-700 rounded border border-slate-600 animate-pulse flex items-center px-3 gap-3">
                <div className="w-7 h-7 bg-slate-600 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-600 rounded w-24" />
                  <div className="h-2 bg-slate-600 rounded w-16" />
                </div>
                <div className="w-10 h-10 bg-slate-600 rounded" />
              </div>
            )}

            {/* reCAPTCHA widget container - hidden until fully ready */}
            <div
              ref={recaptchaRef}
              className={`mb-4 ${!recaptchaReady ? "invisible absolute" : ""}`}
              style={{ minHeight: "78px" }}
            />

            <Button
              onClick={handleVerify}
              disabled={isVerifying || !captchaToken}
              size="lg"
            >
              {isVerifying ? "Verifying..." : "Reveal Email Address"}
            </Button>

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
              <div className="flex-1 bg-slate-900 border-2 border-slate-600 rounded-lg px-4 py-3">
                <span className="text-white font-mono">{email}</span>
              </div>
              <Button
                onClick={handleCopyEmail}
                title="Copy to clipboard"
                size="lg"
              >
                Copy
              </Button>
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
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-white mb-4">
          Other Ways to Connect
        </h2>
        <div className="flex flex-wrap gap-3">
          {externalLinks.map((link, index) => (
            <Button
              key={index}
              href={link.url}
              icon={link.icon}
              download={link.download}
            >
              {link.title}
            </Button>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
