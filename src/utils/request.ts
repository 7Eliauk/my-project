import axios from 'axios'
import { ElMessage } from 'element-plus'

//创建axios实例
const request = axios.create({
  baseURL: 'https://1qa2098ex7204.vicp.fun',
  timeout: 30000,
  //图片识别功能不用json格式
  // headers:{'Content-Type':'application/json'}
})

//请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加token认证
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

//响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    //非200错误提示操作失败
    if (res.code !== 200) {
      ElMessage.error(res.msg || '操作失败')
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    ElMessage.error('网络异常，请稍后尝试')
    return Promise.reject(error)
  },
)

export default request
