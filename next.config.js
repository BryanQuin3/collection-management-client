/** @type {import('next').NextConfig} */
module.exports = {
    images: {
      remotePatterns: [
        {
          hostname: 'cdn.leonardo.ai',
        }
      ],
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/login',
          permanent: true,
        },
      ]
    }
}
