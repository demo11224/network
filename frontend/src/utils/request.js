import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code && res.code !== 200) {
      Message({
        message: res.msg || '系统错误',
        type: 'error',
        duration: 5 * 1000
      })
      // 401: 未登录或token过期
      if (res.code === 401) {
        MessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/logout').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || '系统错误'))
    }
    return res
  },
  error => {
    let message = error.message
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '认证失败，请重新登录'
          store.dispatch('user/logout').then(() => {
            location.reload()
          })
          break
        case 403:
          message = '没有权限访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = error.response.data.msg || '系统错误'
      }
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
