import Cookies from 'js-cookie'
import { Message } from 'element-ui'

export default function({ $axios, redirect }) {
  $axios.onRequest((config) => {
    let token = Cookies.get('authenticationToken')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
  })
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      if (error.response.data.code === -9) {
        Message.error(error.response.data.message)
        window.location.href = 'https://account.easyapi.com/login?from=https://invoice.easyapi.com'
      } else if (error.response.data.code === -8) {
        window.location.href = 'https://team.easyapi.com/new?from=https://invoice.easyapi.com'
      } else if (error.response.data.code === -6) {
        window.location.href = 'https://market.easyapi.com/service/22'
      } else {
        Message.error(error.response.data.message)
      }
    }
  })
}
