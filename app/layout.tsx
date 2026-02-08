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
      <body>
        <div className="my-auto">
          <AuthProvider>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}