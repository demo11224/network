import request from '@/utils/request'

export function listOperLog(query) {
  return request({ url: '/system/log/oper/list', method: 'get', params: query })
}

export function delOperLog(operId) {
  return request({ url: '/system/log/oper/' + operId, method: 'delete' })
}

export function cleanOperLog() {
  return request({ url: '/system/log/oper/clean', method: 'delete' })
}

export function listLoginLog(query) {
  return request({ url: '/system/log/login/list', method: 'get', params: query })
}

export function delLoginLog(infoId) {
  return request({ url: '/system/log/login/' + infoId, method: 'delete' })
}

export function cleanLoginLog() {
  return request({ url: '/system/log/login/clean', method: 'delete' })
}
