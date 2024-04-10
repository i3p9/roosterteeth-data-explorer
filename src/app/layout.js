import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rooster Teeth Data Explorer",
  description: "rooster teeth stuff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container mx-auto px-4 py-2">
          {children}
        </div>
      </body>
    </html>
  );
}
