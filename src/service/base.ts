import axios from 'axios'

import type { IResponseResult } from '@/service/type'

const ERR_OK = 0
const baseURL = '/'

axios.defaults.baseURL = baseURL

export function get<T = any>(url: string, params?: any) {
  return axios
    .get<IResponseResult<T>>(url, {
      params
    })
    .then((res) => {
      const serverData = res.data
      if (serverData.code === ERR_OK) {
        return serverData.result
      }
    })
    .catch((e: string) => {
      console.log(e)
    })
}
