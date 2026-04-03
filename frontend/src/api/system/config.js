import request from '@/utils/request'

export function listConfig(query) {
  return request({ url: '/system/config/list', method: 'get', params: query })
}

export function getConfig(configId) {
  return request({ url: '/system/config/' + configId, method: 'get' })
}

export function addConfig(data) {
  return request({ url: '/system/config', method: 'post', data })
}

export function updateConfig(data) {
  return request({ url: '/system/config', method: 'put', data })
}

export function delConfig(configId) {
  return request({ url: '/system/config/' + configId, method: 'delete' })
}
