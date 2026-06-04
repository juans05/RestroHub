"use client";

import { useEffect, useState } from "react";

export interface SystemConfig {
  logoUrl?: string;
  businessName: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  fontDisplay?: string;
  fontBody?: string;
  animationsEnabled?: boolean;
  animationSpeed?: string;
  currencySymbol: string;
  phone?: string;
  address?: string;
  timezone: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  bannerTitle?: string;
  bannerText?: string;
  seoTitle: string;
  seoDescription: string;
  maxPeoplePerReservation: number;
  minOrderAdvanceHours?: number;
  ctaTitle?: string;
  ctaText?: string;
  ctaButton?: string;
  navLinks?: { label: string; href: string }[];
}

export function useSystemConfig() {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/public/settings");

        if (!response.ok) {
          throw new Error("Failed to fetch system configuration");
        }

        const data = await response.json();
        setConfig(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching system config:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setConfig(null);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
}
