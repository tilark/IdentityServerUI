import request from '@/utils/request'
export function getImplicitClients(params) {
  return request({
    url: '/ClientManage/GetImplicitClientsByCondition',
    method: 'get',
    params
  })
}

export function postImplicitClientCreate(params) {
  return request({
    url: '/ClientManage/PostImplicitClientCreate',
    method: 'post',
    data: { params }
  })
}
