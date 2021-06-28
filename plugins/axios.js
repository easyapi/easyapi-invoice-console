import Cookies from 'js-cookie'

export default function ({ $axios, redirect }) {
  $axios.onRequest((config) => {
    let token = Cookies.get('Authorization');
    token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6aGFuZzIwMDg0QDEyNi5jb20iLCJhdXRoIjoiUk9MRV9BRE1JTiIsImV4cCI6MTYyNTk4MTE0M30.OmXmOKItKPKUXvz8HnAAzRQUczIgIkceiEsrqXyv2bd_C2FYA7cJ0wDVEIZx071jIxnQZN1sEi47K-8RWmbijQ";
    if (token) {
      config.headers.Authorization =
        'Bearer ' + token
    }
  })
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      if (error.response.data.code === -9) {
        window.location.href =
          'https://account.easyapi.com/login?from=https://market.easyapi.com'
      } else if (error.response.data.code === -8) {
        window.location.href =
          'https://team.easyapi.com/new?from=https://doc.easyapi.com'
      } else {
        this.$message.warning(error.response.data.message)
      }
    }
  })
}
