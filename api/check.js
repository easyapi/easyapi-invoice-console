import {serviceUrl} from './api'

/**
 * 根据发票代码，发票号码查验
 *
 * @see https://www.easyai.com
 */
 export const checkInvoice = (params, context) => {
  return context.$axios.get(`${serviceUrl}/check-invoice/code-number`, {params: {...params}})
};