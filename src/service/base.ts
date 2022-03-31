import axios from 'axios'
import { AxiosResponse } from 'axios'
import type { IResponseResults } from '@/service/type'

const ERR_OK = 0
const baseURL = '/'

axios.defaults.baseURL = baseURL

export function get(url: string, params?: any) {
  return axios
    .get<IResponseResults>(url, {
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
