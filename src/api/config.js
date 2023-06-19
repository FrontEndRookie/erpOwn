import DcUtils from '@/utils'
import { Message } from 'element-ui'
import Router from '@/router'
const axios = require("axios")
const { BASE_URL } = process.env
const http = axios.create({
  baseURL: BASE_URL,
  async: true,
  crossDomain: true,
  headers: {
    'content-type': 'application/json',
  },
})

// 全局loading
let globalLoading = null

// 一些默认设置
const HttpDefaults = {
  errorCatch: false, // 是否使用自定义的错误提示
  loading: false, // 是否使用接口loading
}
Object.entries(HttpDefaults).map(([key, val]) => {
  http.defaults[key] = val
})

// 添加请求拦截器
http.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  const tokenId = sessionStorage.getItem('tokenId')
  config.headers['tokenId'] = tokenId
  if (config.loading) {
    globalLoading = DcUtils.createLoading()
  }
  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 对响应数据做点什么
  const { data: { code, message }, data, config } = response
  if (!code) {
    if (config.loading) {
      globalLoading && globalLoading.close()
    }
    return response
  }
  switch (code) {
    case 200:
      break;
    // token过期
    case -405:
      Router.replace({
        path: '/login',
        query: { forbiddenInfo: true }
      })
      return
    case -406:
      Router.replace({
        path: '/login',
        query: { close: true }
      })
      return
    case -200:
      if(window.location.hash.indexOf("/login")>-1){
        return
      }
      Router.replace({
        path: '/login',
        query: { redirect: Router.currentRoute.fullPath}
      })
      Message.error(message)
      if (config.errorCatch) {
        Message.error(message)
        break;
      }
    case -401:
      console.error(`${config.url}  无权访问  ${code}`)
      break;
    default:
      if (!config.errorCatch) {
        Message.error(message)
      }
      if (config.loading) {
        globalLoading && globalLoading.close()
      }
      return Promise.reject(data)
  }
  if (config.loading) {
    globalLoading && globalLoading.close()
  }
  return response
}, (error) => {
  const { config, message } = error
  if (!config.errorCatch) {
    Message.error(message)
  }
  return Promise.reject(error)
})

export default http