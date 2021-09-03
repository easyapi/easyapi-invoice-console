const path = require('path')

module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: '{{ name }} - EasyAPI发票管理',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: '{{escape description }}',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [],
  },
  css: [
    '@/assets/scss/common.scss',
    '@/assets/scss/element-variables.scss',
    '@/assets/scss/icon-font.scss'
  ],
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/axios',
    '@/plugins/router',
    { src: '@/plugins/common.js', ssr: false },
    { src: '@/plugins/icons', ssr: false },
  ],
  /*
   ** Customize the progress bar color
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/style-resources'],
  router: {
    base: '/console/',
  },
  axios: {},
  loading: {
    color: '#18c1d6',
    failedColor: '#18c1d6',
  },
  styleResources: {
    scss: './assets/scss/variables.scss',
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/, 'vue-quill-editor', 'v-distpicker'],
    extend(config, ctx) {
      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))
      svgRule.exclude = [path.resolve(__dirname, 'assets/svg')]
      // Includes /icons/svg for svg-sprite-loader
      config.module.rules.push({
        test: /\.svg$/,
        include: [path.resolve(__dirname, 'assets/svg')],
        loader: 'svg-sprite-loader',
        options: {
          symbolId: 'icon-[name]',
        },
      })
    },
    maxChunkSize: 300000, // 单个包最大尺寸
    extractCSS: true, // 单独提取CSS
  },
  server: {
    port: 3000,
  },
  env: {
    baseUrl: 'https://api.easyapi.com',
    accountUrl: 'https://account-api.easyapi.com',
  },
}
