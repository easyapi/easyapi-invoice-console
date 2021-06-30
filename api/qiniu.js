/**
 * 获取七牛KEY
 */
export const getqnkey = (context) => {
  return context.$axios.get(`https://api.easyapi.com/qiniu/key`)
}


/**
 * 获取七牛空间TOKEN
 */
export const getqnToken = (context) => {
  return context.$axios.get(`https://api.easyapi.com/qiniu/upToken`)
}
