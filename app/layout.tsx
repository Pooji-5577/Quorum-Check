import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quorum Check - Real-Time Social Polling Platform",
  description:
    "Quorum Check is a premium social polling platform with debate mode, real-time sentiment maps, AI insights, verified community polls, and anonymous accountable voting.",
  icons: {
    icon: "/img/favicon/favicon.ico",
    apple: "/img/favicon/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans text-ink antialiased selection:bg-lilac selection:text-white">
        <div className="pointer-events-none fixed inset-0 grid-mesh opacity-70" />
        {children}
      </body>
    </html>
  );
}
