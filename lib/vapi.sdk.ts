import Vapi from '@vapi-ai/web';

// For client-side components, you need NEXT_PUBLIC_ prefix
const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

if (!VAPI_PUBLIC_KEY) {
  console.error("❌ VAPI_PUBLIC_KEY is not set. Make sure you have NEXT_PUBLIC_VAPI_PUBLIC_KEY in your .env.local file");
} else {
  console.log("✅ VAPI SDK initialized successfully");
}

export const vapi = new Vapi(VAPI_PUBLIC_KEY || "");

// Debug logging (remove in production)
console.log("VAPI Key available:", !!VAPI_PUBLIC_KEY);
console.log("VAPI instance created:", !!vapi);