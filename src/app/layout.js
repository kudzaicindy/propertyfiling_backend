import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Property Filing System",
  description: "Backend API for Property Filing System",
};

// Server initialization logging
console.log('🚀 Starting Property List Backend Server...');
console.log(`📡 Server running on: http://localhost:${process.env.PORT || 3000}`);
console.log('🔍 API endpoints available at:');
console.log('   - GET  /api/properties');
console.log('   - POST /api/properties');
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
