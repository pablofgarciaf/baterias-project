/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — firebase.ts
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/lib/firebase.ts
 * 🏷️ Type: Library / Configuration
 * 📦 Module: Shared
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L020-L023  → Imports & dependencies
 *   L025-L033  → Firebase client configuration
 *   L035-L040  → Configuration validator (isFirebaseConfigured)
 *   L042-L044  → Firebase service instances (app, auth, db)
 *   L046-L052  → Analytics initialization helper (initAnalytics)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "lo pondre yo mismo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "maresa-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "maresa-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "maresa-project.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "yo mismo"
};

// Check if Firebase is ready with real API key
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "lo pondre yo mismo" &&
  firebaseConfig.projectId
);

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics runs safely in browser environment
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};
