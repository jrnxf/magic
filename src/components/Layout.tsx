import React, { ReactElement } from 'react'
import { Navbar } from '@/components/Navbar'

export const Layout = ({ children }: { children: ReactElement }) => (
  <main className="w-screen h-screen mx-auto text-white bg-mirage-600">
    <Navbar />
    <div className="w-full max-w-3xl p-6 mx-auto">{children}</div>
  </main>
)
