import "./globals.css";
import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const kanit = Kanit({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ปรับรอบพรบ. V.2",
  description: "Billing System",
  icons: {
    icon: "/calendar-svgrepo-com.svg", // Path to your favicon file
    // You can also add other icons like apple-touch-icon:
    // apple: "/apple-icon.png",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`font-kanit ${inter.variable} ${kanit.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
