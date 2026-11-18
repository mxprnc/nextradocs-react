import nextra from 'nextra'

const withNextra = nextra({
  // Nextra configuration
})

export default withNextra({
  // Generate static HTML, CSS and JavaScript files
  output: 'export',

  // GitHub Pages Project Site base path
  basePath: process.env.PAGES_BASE_PATH || '',

  // Generate /page/index.html instead of /page.html
  trailingSlash: true,

  // Disable Next.js Image Optimization
  images: {
    unoptimized: true
  }
})
