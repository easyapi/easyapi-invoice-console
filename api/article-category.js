import {serviceUrl} from './api'

/**
 * 获取文章分类
 */
export const getArticleCategoryList = (params, context) => {
  return context.$axios.get(`${serviceUrl}/api/article/categories`, params)
}

/**
 * 获取文章信息
 */
export const getArticleCategory = (id, params, context) => {
  return context.$axios.get(`${serviceUrl}/api/article/category/${id}`, params)
}

/**
 * 新增文章分类
 */
export const createArticleCategory = (data, context) => {
  return context.$axios.post(`${serviceUrl}/api/article/category`, data)
}

/**
 * 修改文章分类
 */
export const updateArticleCategory = (id, data, context) => {
  return context.$axios.put(`${serviceUrl}/api/article/category/${id}`, data)
}

/**
 * 删除文章分类
 */
export const deleteArticleCategory = (id, data, context) => {
  return context.$axios.delete(`${serviceUrl}/api/article/category/${id}`, data)
}
