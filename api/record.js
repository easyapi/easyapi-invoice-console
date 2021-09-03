/**
 * 获取查验记录
 *
 * @see https://www.easyai.com
 */
 export const getCheckRecords = (params, context) => {
    return context.$axios.get(`${process.env.baseUrl}/console/checkInvoiceRecord`, {params: {...params}})
  };