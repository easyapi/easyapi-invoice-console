<template>
  <!-- 通过accessToken和手机号 跳转页 -->
  <div></div>
</template>
<script>
import Cookies from 'js-cookie'

export default {
  name: 'AccessToken',
  data: function() {
    return {
      accessToken: '',
      username: ''
    }
  },
  created() {
    //获取accessToken
    this.accessToken = this.$route.query.accessToken
    // 获取username(手机号)
    this.username = this.$route.query.username
  },
  mounted() {
    let params = {
      accessToken: this.accessToken,
      username: this.username
    }
  }
}
</script>
