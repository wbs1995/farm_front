import request from '@/utils/request'

export function add(name) {
  return request({
    url: '/greenhouse/add.do',
    method: 'post',
    data: {name}
  })
}

export function getList(params) {
  return request({
    url: '/greenhouse/list.do',
    method: 'get',
    params
  })
}

export function greenhouseListNoPage(params) {
  return request({
    url: '/greenhouse/list_no_page.do',
    method: 'get',
    params
  })
}

export function remove(id) {
  return request({
    url: '/greenhouse/delete.do',
    method: 'get',
    data: {id}
  })
}
