"use client";

import React from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeProvider';
import Head from 'next/head';

const styles = `
  html.light {
    background-color: #fff;
    color: #333;
  }
  html.dark {
    background-color: #121212;
    color: #ccc;
  }
`;

function MyApp({ Component, pageProps }) {
  const { theme } = useTheme();

  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Book Catalog</title>
        <style>{styles}</style>
      </Head>
      <html className={theme}>
        <body>
          <ThemeProvider>
            <Settings />
            <Component {...pageProps} />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}

export default MyApp;