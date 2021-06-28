import {serviceUrl} from './api'

/**
 * 获取文章列表
 *
 * @see https://www.easyai.com
 */
export const getArticleList = (params, context) => {
  return context.$axios.get(`${serviceUrl}/api/articles`, {params: {...params}})
};

/**
 * 添加文章
 */
export const createArticle = (data, context) => {
  return context.$axios.post(`${serviceUrl}/api/article`, data)
};

/**
 * 修改文章
 */
export const updateArticle = (id, data, context) => {
  return context.$axios.put(`${serviceUrl}/api/article/${id}`, data)
};

/**
 * 删除文章
 */
export const deleteArticle = (id, context) => {
  return context.$axios.delete(`${serviceUrl}/api/article/${id}`)
};
