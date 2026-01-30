/**
 * DataDrift theme tokens.
 * Neutral, professional, light UI inspired by modern data platforms.
 * Do not copy branding or proprietary assets; apply to DataDrift concepts only.
 */
export const theme = {
  colors: {
    background: {
      primary: "#ffffff",
      secondary: "#f5f6f8",
      tertiary: "#e8eaed",
      sidebar: "#f0f1f3",
    },
    text: {
      primary: "#1a1d21",
      secondary: "#5c6370",
      muted: "#8b919e",
    },
    border: {
      subtle: "#e0e2e6",
      default: "#d1d5db",
    },
    accent: {
      primary: "#2563eb",
      primaryHover: "#1d4ed8",
      link: "#2563eb",
    },
    status: {
      success: "#059669",
      error: "#dc2626",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  borderRadius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
  },
  sidebar: {
    width: "240px",
  },
  header: {
    height: "52px",
  },
} as const;

export type Theme = typeof theme;
