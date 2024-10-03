import "./globals.css";


export const metadata = {
  title: "Visisphere",
  description: "Seeing the world with a complete new way.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
