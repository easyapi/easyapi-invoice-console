/**
 * 根据发票代码，发票号码查验
 *
 * @see https://www.easyai.com
 */
export const checkInvoiceCode = (params, context) => {
  return context.$axios.get(
    `${process.env.baseUrl}/check-invoice/code-number`,
    { params: { ...params } }
  )
}

/**
 * 根据图片查验
 *
 * @see https://www.easyai.com
 */
export const checkInvoiceUrl = (params, context) => {
  return context.$axios.get(`${process.env.baseUrl}/check-invoice/url`, {
    params: { ...params }
  })
}

/**
 * 根据二维码查验
 *
 * @see https://www.easyai.com
 */
export const checkInvoiceQrCode = (params, context) => {
  return context.$axios.get(`${process.env.baseUrl}/check-invoice/qr-code`, {
    params: { ...params }
  })
}
