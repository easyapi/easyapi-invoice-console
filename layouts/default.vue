<template>
  <nuxt :keep-alive="isKeepActive" :keep-alive-props='{ include: includeArr }'/>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState(['isKeepActive'])
    },
    data() {
      return {
        includeArr: ['invoiceList'] // 需要缓存的组件名数组
      }
    }
  }
</script>

<style>
  html {
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }
</style>
