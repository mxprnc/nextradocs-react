import type { ReactNode } from 'react'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: {
    default: 'NextraDocs React',
    template: '%s | NextraDocs React'
  },
  description: 'React Technical Documentation'
}

const navbar = (
  <Navbar
    logo={<b>NextraDocs React</b>}
  />
)

const footer = (
  <Footer>
    MIT {new Date().getFullYear()} © NextraDocs React.
  </Footer>
)

type RootLayoutProps = {
  children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" dir="ltr" suppressHydrationWarning>
      <Head />

      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
