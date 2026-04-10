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
    // 对于流式响应，直接返回完整的响应对象
    if (response.config.responseType === 'stream') {
      return response
    }
    
    const res = response.data
    // 检查是否是带有 data: 前缀的文本响应
    if (typeof res === 'string' && res.includes('data:')) {
      // 直接返回原始响应，由调用方处理
      return res
    }
    // 对于 JSON 响应，检查 code 字段
    if (typeof res === 'object' && res.code !== 200) {
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
