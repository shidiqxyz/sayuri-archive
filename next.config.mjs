import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  async redirects() {
    return [
      // /archive merged into home
      { source: '/archive', destination: '/#archive', permanent: true },
    ]
  },
}

export default withMDX(nextConfig)