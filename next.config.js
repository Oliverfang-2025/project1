/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['oss.of2088.top'], // 允许从阿里云OSS加载图片
  },
  // 如果部署到子路径，设置basePath
  // basePath: '/website',
}; 