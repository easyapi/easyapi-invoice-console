<template>
  <!-- 通过accessToken和手机号 跳转页 -->
  <div></div>
</template>
<script>
// import { getBearerToken } from '../api/access-token'
import Cookies from 'js-cookie'

export default {
  name: 'AccessToken',
  data: function () {
    return {
      accessToken: '',
      username: '',
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
      username: this.username,
    }
    getBearerToken(params, this)
      .then((res) => {
        if (res.status === 200) {
          this.$message.success('登录成功')
          Cookies.set('fpAuthToken', res.data.id_token, { expires: 30 })
          this.$store.dispatch('getUserInfo', this)
          let completeness = JSON.parse(
            localStorage.getItem('userInfo')
          ).completeness
          if (completeness !== 100) {
            setTimeout(() => {
              this.$router.push('/authentication')
            }, 500)
          } else {
            setTimeout(() => {
              this.$router.push('/')
            }, 0)
          }
        } else {
          this.$message.success(res.data.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
}
</script>
