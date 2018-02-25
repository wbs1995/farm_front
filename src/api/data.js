import request from '@/utils/request'

export function getData(params) {
  return request({
    url: '/data/list.do',
    method: 'get',
    params
  })
}
