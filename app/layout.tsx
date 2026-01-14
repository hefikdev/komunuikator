import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Komunikator - Czat w czasie rzeczywistym",
  description: "Prosty i bezpieczny komunikator z możliwością przesyłania plików",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
