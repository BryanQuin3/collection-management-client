/** @type {import('next').NextConfig} */
module.exports = {
    images: {
      remotePatterns: [
        {
          hostname: 'cdn.leonardo.ai',
        }
      ],
    },
    exportPathMap:function(){
      return{
        '/':{page:'/login'},
      }
  }
}
