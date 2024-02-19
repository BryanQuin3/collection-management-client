/** @type {import('next').NextConfig} */
module.exports = {
    images: {
      remotePatterns: [
        {
          hostname: '*',
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
