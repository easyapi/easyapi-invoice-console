import {serviceUrl} from './api'

/**
 * 获取查验记录
 *
 * @see https://www.easyai.com
 */
 export const getCheckRecords = (params, context) => {
    return context.$axios.get(`${serviceUrl}/console/checkInvoiceRecord`, {params: {...params}})
  };