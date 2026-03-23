import request from '../utils/request'

// 发送注册验证码
export const sendRegisterCode = (email: string) => {
  return request.post('/api/auth/send-email-code', { email })
}

// 用户注册
export const register = (data: {
  username: string
  password: string
  email: string
  code: string
}) => {
  return request.post('/api/auth/register', data)
}
// 用户登录
export const login = (data: {
  username?: string
  email?: string
  password: string
}) => {
  return request.post('/api/auth/login', data)
}

// 退出登录
export const logout = () => {
  return request.post('/api/auth/logout')
}

// 食物识别接口
// export const recognizeDish = (image: File) => {
//   const formData = new FormData()
//   formData.append('image', image)
//   return request.post('/api/dish/recognize', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
// }
export function recognizeDish(file:any){
  //1、创建Formdata()
  const formData=new FormData()
  //2、把图片放进FormData
  formData.append('images',file)

  return request({
    url:'/api/dish/recognize',
    method:'post',
    data:formData,
    // headers:{
    //   'Content-Type':'multipart/form-data' //图片以formdata形式传过去
    // }
  })
}