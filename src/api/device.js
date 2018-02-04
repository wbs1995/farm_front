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

export function deviceRegister(params) {
  return request({
    url: '/device/register.do',
    method: 'post',
    params
  })
}
