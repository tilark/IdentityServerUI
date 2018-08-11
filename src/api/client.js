import request from '@/utils/request'
export function getClients(params) {
  return request({
    url: '/ClientManage/GetClientByCondition',
    method: 'get',
    params
  })
}
