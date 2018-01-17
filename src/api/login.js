import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login.do',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info.do',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout.do',
    method: 'post'
  })
}
