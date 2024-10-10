import { ThemeProvider } from "next-themes";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Podcast Player",
  description: "Play RSS feeds in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="container mx-auto p-4 min-h-screen">
            <div className="flex justify-end">
              <h1 className="text-2xl font-bold mb-4 flex-grow">Simple RSS Podcast Player</h1>
              <ThemeSwitcher />
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html >
  );
}
