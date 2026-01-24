import { NextRequest, NextResponse } from "next/server";

// Email is stored encoded and split - not directly scrapable
// To encode your email parts, run:
// echo -n "username" | base64
// echo -n "domain.com" | base64
const EMAIL_PARTS = {
  user: "amFjcXVlcy5oZW5yaS5oZWJlcnQ=", // base64
  domain: "Z21haWwuY29t", // base64
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    console.log("Received verification request");

    if (!token) {
      console.log("No token provided in request");
      return NextResponse.json(
        { error: "No captcha token provided" },
        { status: 400 },
      );
    }

    // Verify the reCAPTCHA token with Google
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY not configured in environment");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    console.log("Verifying token with Google reCAPTCHA...");

    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
    const verificationResponse = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const verificationData = await verificationResponse.json();

    console.log("reCAPTCHA verification response:", {
      success: verificationData.success,
      score: verificationData.score,
      action: verificationData.action,
      errorCodes: verificationData["error-codes"],
    });

    if (!verificationData.success) {
      console.log(
        "Captcha verification failed:",
        verificationData["error-codes"],
      );
      return NextResponse.json(
        {
          error: "Captcha verification failed",
          details: verificationData["error-codes"],
        },
        { status: 400 },
      );
    }

    // Note: reCAPTCHA v2 doesn't have a score, only success/fail
    // v3 would have a score between 0.0 - 1.0

    // Decode and construct email only after successful verification
    const user = Buffer.from(EMAIL_PARTS.user, "base64").toString("utf-8");
    const domain = Buffer.from(EMAIL_PARTS.domain, "base64").toString("utf-8");
    const email = `${user}@${domain}`;

    console.log("Verification successful, returning email");

    // Return the email in a way that requires JavaScript to display
    // Adding a simple obfuscation layer
    const obfuscatedEmail = Buffer.from(email).toString("base64");

    return NextResponse.json({
      success: true,
      data: obfuscatedEmail,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Captcha verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
