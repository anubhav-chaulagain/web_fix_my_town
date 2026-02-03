
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <AuthProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
        
      </body>
    </html>
  );
}
