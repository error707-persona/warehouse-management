"use client"

import "./globals.css";
import React from "react";
import { CssBaseline } from "@mui/material";
import StoreProvider from "./redux";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [isDarkMode, setIsDarkMode] = useState(false);
  // // const toggleTheme = () => setIsDarkMode((prev) => !prev);
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {/* <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}> */}
            <CssBaseline />
            {children}{" "}
          {/* </ThemeProvider> */}
        </StoreProvider>
      </body>
    </html>
  );
}
