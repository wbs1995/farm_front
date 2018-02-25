import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/device/list.do',
    method: 'get',
    params
  })
}

export function fetchListNoPage() {
  return request({
    url: '/device/list_no_page.do',
    method: 'get'
  })
}

export function deviceRegister(did) {
  return request({
    url: '/device/register.do',
    method: 'post',
    data: {
      did
    }
  })
}

export function deviceUpdate(params) {
  return request({
    url: '/device/update.do',
    method: 'post',
    params
  })
}

export function bindGreenhouse(did, hid) {
  return request({
    url: '/device/bind_greenhouse.do',
    method: 'post',
    data: {
      did,
      hid
    }
  })
}

