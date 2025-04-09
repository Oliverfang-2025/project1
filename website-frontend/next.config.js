/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    // domains: ['oss.of2088.top'], // 允许从阿里云OSS加载图片
    // 暂时禁用OSS服务，因为访问oss.of2088.top时出现错误
    // 图片将从本地public目录加载
    remotePatterns: [
      // 未来如果OSS服务可用，可以在此配置其他可信域名
    ],
  },
  // 如果部署到子路径，设置basePath
  // basePath: '/website',
}; 