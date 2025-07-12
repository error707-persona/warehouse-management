"use client"

import "./globals.css";
import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import StoreProvider from "./redux";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            {children}{" "}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
