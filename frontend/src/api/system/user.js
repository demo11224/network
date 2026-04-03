import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({ url: '/system/user/list', method: 'get', params: query })
}

// 查询用户详细
export function getUser(userId) {
  return request({ url: '/system/user/' + userId, method: 'get' })
}

// 新增用户
export function addUser(data) {
  return request({ url: '/system/user', method: 'post', data })
}

// 修改用户
export function updateUser(data) {
  return request({ url: '/system/user', method: 'put', data })
}

// 删除用户
export function delUser(userId) {
  return request({ url: '/system/user/' + userId, method: 'delete' })
}

// 重置密码
export function resetUserPwd(userId, password) {
  return request({ url: '/system/user/resetPwd', method: 'put', data: { userId, password } })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  return request({ url: '/system/user/changeStatus', method: 'put', data: { userId, status } })
}
