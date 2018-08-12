import request from '@/utils/request'
export function getApiResources(params) {
  return request({
    url: '/ApiResources/GetApiResourcesForClient',
    method: 'get',
    params
  })
}
