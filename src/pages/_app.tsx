import { AuthProvider } from '@/context/auth.context'
import type { AppProps } from 'next/app'
import React from 'react'
import { Layout } from '@/components/Layout'
import '@/styles/global.css'
import '@fontsource/inter/variable-full.css' // Defaults to weight 400.

const MyApp = ({ Component, pageProps }: AppProps) => (
  <AuthProvider initialUser={pageProps?.authdUser || null}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </AuthProvider>
)

export default MyApp
