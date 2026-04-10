<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { sendRegisterCode, register, login } from '../api/auth'

const router = useRouter()
const route = useRoute()

// 登录表单
const username = ref('')
const password = ref('')
const loginErrorMessage = ref('')
const isLoginLoading = ref(false)

// 注册表单
const registerUsername = ref('')
const registerPassword = ref('')
const confirmPassword = ref('')
const registerErrorMessage = ref('')
const email = ref('')
const registerCode = ref('')
const codeBtnDisabled = ref(false)
const codeError = ref('')
const emailError = ref('')
const countDown = ref(0)
const codeBtnText = ref('获取验证码')
const isLoading = ref(false)
const isRegistering = ref(false)

// 模式切换
const isSignUpMode = ref(false)
const containerClass = computed(() => {
  return isSignUpMode.value ? 'container sign-up-mode' : 'container'
})

// 组件挂载时根据路由设置模式
onMounted(() => {
  isSignUpMode.value = route.path === '/register'
})

// 切换到注册模式
const switchToSignUp = () => {
  isSignUpMode.value = true
  router.push('/register')
}

// 切换到登录模式
const switchToSignIn = () => {
  isSignUpMode.value = false
  router.push('/login')
}

// 邮箱格式验证
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email.value && !emailRegex.test(email.value)) {
    emailError.value = '请输入有效的邮箱地址'
    return false
  } else {
    emailError.value = ''
    return true
  }
}

// 验证码发送功能
const sendCode = async () => {
  if (!validateEmail() || !email.value) {
    emailError.value = '请输入有效的邮箱地址'
    return
  }

  try {
    isLoading.value = true
    // 调用真实的API发送验证码
    await sendRegisterCode(email.value)
    ElMessage.success('验证码发送成功，请注意查收')

    // 倒计时功能
    countDown.value = 60
    codeBtnDisabled.value = true
    codeBtnText.value = `${countDown.value}秒后重新获取`
    // 定时器，每秒钟减少倒计时时间
    const timer = setInterval(() => {
      countDown.value--
      codeBtnText.value = `${countDown.value}秒后重新获取`

      if (countDown.value <= 0) {
        clearInterval(timer)
        codeBtnDisabled.value = false
        codeBtnText.value = '获取验证码'
      }
    }, 1000)
  } catch (error: any) {
    console.error(error)
    codeError.value = error.message || '验证码发送失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 验证码格式验证
const validateCode = () => {
  if (registerCode.value && registerCode.value.length !== 6) {
    codeError.value = '验证码必须为6位数字'
    return false
  } else {
    codeError.value = ''
    return true
  }
}

// 注册验证
const handleRegister = async () => {
  if (
    !registerUsername.value ||
    !registerPassword.value ||
    !confirmPassword.value ||
    !email.value ||
    !registerCode.value
  ) {
    registerErrorMessage.value = '请填写所有字段'
    return
  }

  if (registerPassword.value !== confirmPassword.value) {
    registerErrorMessage.value = '两次输入的密码不一致'
    return
  }

  if (!validateEmail()) {
    emailError.value = '请输入有效的邮箱地址'
    return
  }

  if (!validateCode()) {
    codeError.value = '验证码必须为6位数字'
    return
  }

  try {
    isRegistering.value = true
    // 调用真实的API注册用户
    await register({
      username: registerUsername.value,
      password: registerPassword.value,
      email: email.value,
      code: registerCode.value,
    })

    ElMessage.success('注册成功，请登录')

    // 注册成功后切换到登录模式
    isSignUpMode.value = false
  } catch (error: any) {
    registerErrorMessage.value = error.msg || '注册失败，请稍后重试'
  } finally {
    isRegistering.value = false
  }
}

// 验证密码是否匹配，在离开输入框时调用
const validatePasswordMatch = () => {
  if (registerPassword.value && confirmPassword.value && registerPassword.value !== confirmPassword.value) {
    registerErrorMessage.value = '两次输入的密码不一致'
  } else if (registerPassword.value && confirmPassword.value && registerPassword.value === confirmPassword.value) {
    registerErrorMessage.value = ''
  }
}

// 登录验证
const handleLogin = async () => {
  // 简单的表单验证
  if (!username.value || !password.value) {
    loginErrorMessage.value = '请输入用户名和密码'
    return
  }

  try {
    isLoginLoading.value = true
    // 调用登录API
    const response = await login({
      username: username.value,
      password: password.value,
    })

    // 登录成功，保存token和用户信息
    console.log('登录响应数据:', response.data)

    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }

    // 直接保存userId
    if (response.data.userId) {
      localStorage.setItem('userId', String(response.data.userId))
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          userId: response.data.userId,
          username: response.data.username || username.value,
        })
      )
    }

    ElMessage.success('登录成功')

    // 登录成功后跳转到主页
    router.push('/home')
  } catch (error: any) {
    loginErrorMessage.value = error.msg || '登录失败，请检查用户名和密码'
    ElMessage.error(loginErrorMessage.value)
  } finally {
    isLoginLoading.value = false
  }
}
</script>

<template>
  <div :class="containerClass">
    <div class="form-warp">
      <!-- 登录表单 -->
      <form class="sign-in-form" @submit.prevent="handleLogin">
        <h1 class="brand-title">智膳坊</h1>
        <h2 class="form-title">登录</h2>
        <input type="text" v-model="username" placeholder="用户名" />
        <input type="password" v-model="password" placeholder="密码" />
        <p v-if="loginErrorMessage" class="error-message">{{ loginErrorMessage }}</p>
        <div class="submit-btn" :class="{ disabled: isLoginLoading }" @click="handleLogin">
          {{ isLoginLoading ? '登录中...' : '立即登录' }}
        </div>
      </form>
      
      <!-- 注册表单 -->
      <form class="sign-up-form" @submit.prevent="handleRegister">
        <h1 class="brand-title">智膳坊</h1>
        <h2 class="form-title">注册</h2>
        <div class="input-with-error">
          <input type="text" v-model="registerUsername" placeholder="用户名" />
        </div>
        <div class="input-with-error">
          <input type="email" v-model="email" placeholder="邮箱" @blur="validateEmail" />
          <span v-if="emailError" class="field-error-right">{{ emailError }}</span>
        </div>
        <div class="input-with-error">
          <div class="code-input-wrapper">
            <input 
              type="text" 
              v-model="registerCode" 
              placeholder="验证码" 
              @blur="validateCode" 
            />
            <span 
              class="code-link" 
              @click="sendCode" 
              :class="{ disabled: codeBtnDisabled || isLoading }"
            >
              {{ isLoading ? '发送中...' : codeBtnText }}
            </span>
          </div>
          <span v-if="codeError" class="field-error-right">{{ codeError }}</span>
        </div>
        <div class="input-with-error">
          <input type="password" v-model="registerPassword" placeholder="密码" @blur="validatePasswordMatch" />
        </div>
        <div class="input-with-error">
          <input type="password" v-model="confirmPassword" placeholder="确认密码" @blur="validatePasswordMatch" />
        </div>
        <p v-if="registerErrorMessage" class="error-message">{{ registerErrorMessage }}</p>
        <div class="submit-btn" :class="{ disabled: isRegistering }" @click="handleRegister">
          {{ isRegistering ? '注册中...' : '立即注册' }}
        </div>
      </form>
    </div>
    
    <div class="desc-warp">
      <div class="desc-warp-item sign-up-desc">
        <div class="content">
          <button id="sign-up-btn" @click="switchToSignUp">注册</button>
        </div>
        <img src="../assets/log.svg" alt="" />
      </div>
      <div class="desc-warp-item sign-in-desc">
        <div class="content">
          <button id="sign-in-btn" @click="switchToSignIn">登录</button>
        </div>
        <img src="../assets/register.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  color: #333;
}

.container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

.container::before {
  content: " ";
  position: absolute;
  width: 2000px;
  height: 2000px;
  border-radius: 50%;
  background-image: linear-gradient(-45deg, #ff7043 0%, #ffca28 100%);
  transition: 1.8s ease-in-out;
  z-index: 6;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
}

.container.sign-up-mode::before {
  transform: translate(100%, -50%);
}

.form-warp {
  width: 50%;
  position: absolute;
  z-index: 5;
  left: 75%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: 1fr;
  transition: 1s 0.7s ease-in-out; 
}

.form-warp form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  /* 将两个 form 布局在 grid 同一位置 */
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  transition: all 0.2s 0.7s;
  opacity: 1;
  z-index: 4;
}

.form-title {
  color: #ff7043;
}

.brand-title {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 36px;
  font-weight: bold;
  color: #ff7043;
  margin-bottom: 10px;
  text-shadow: 
    1px 1px 0px #ffffff,
    2px 2px 0px #ff9800,
    3px 3px 0px #f57c00,
    4px 4px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 4px;
  transform: skew(-5deg);
  text-align: center;
  display: inline-block;
  padding: 0 10px;
}

.form-warp .sign-up-form {
  opacity: 0;
  z-index: 3;
}

.container.sign-up-mode .form-warp {
  left: 25%;
}

.container.sign-up-mode .sign-in-form {
  opacity: 0;
  z-index: 3;
}

.container.sign-up-mode .sign-up-form {
  opacity: 1;
  z-index: 4;
}

input,
.submit-btn {
  min-width: 300px;
  outline: none;
  padding: 12px 30px;
  line-height: 1;
  font-size: 16px;
  border-radius: 60px;
  color: #333;
  background-color: #fff3e0;
  border: none;
}

input::placeholder {
  color: #cccc;
}

.submit-btn {
  background-color: #ff7043;
  color: #FFF;
  text-align: center;
  min-width: 150px;
  font-size: initial;
  font-weight: bold;
  letter-spacing: 1.5px;
  cursor: pointer;
}

.submit-btn.disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.desc-warp {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.desc-warp-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  padding: 3rem 17% 2rem 12%;
  z-index: 6;
}

/* 事件穿透 BEGIN */
.sign-in-desc {
  pointer-events: none;
}

.sign-up-mode .sign-in-desc {
  pointer-events: all;
}

.sign-up-mode .sign-up-desc {
  pointer-events: none;
}
/* 事件穿透 END */

.content {
  width: 100%;
  transition: transform 0.9s ease-in-out;
  transition-delay: .6s;
}

.sign-in-desc img,
.sign-in-desc .content {
  transform: translateX(800px);
}

.sign-up-mode .sign-in-desc img,
.sign-up-mode .sign-in-desc .content {
  transform: translateX(0);
}

.sign-up-mode .sign-up-desc img,
.sign-up-mode .sign-up-desc .content {
  transform: translateX(-800px);
}

button {
  outline: none;
  padding: 6px 8px;
  min-width: 100px;
  text-align: center;
  border-radius: 30px;
  border: 2px solid #FFF;
  background: none;
  color: #FFF;
  cursor: pointer;
  transition: all .3s ease;
}

button:active {
  background: rgba(255, 255, 255, .1);
}

img {
  width: 100%;
  display: block;
  transition: transform 0.9s ease-in-out;
  transition-delay: .5s;
}

/* 验证码相关样式 */
.code-input-wrapper {
  position: relative;
  min-width: 300px;
}

.code-input-wrapper input {
  padding-right: 80px;
}

.code-link {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff7043;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: color 0.3s;
}

.code-link:hover:not(.disabled) {
  color: #ffca28;
}

.code-link.disabled {
  color: #ccc;
  cursor: not-allowed;
  text-decoration: none;
}

/* 错误提示 */
.error-message {
  color: #f54444;
  font-size: 14px;
  text-align: center;
  width: 100%;
  min-width: 300px;
}

.input-with-error {
  position: relative;
  min-width: 300px;
}

.field-error-right {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 10px;
  color: #f54444;
  font-size: 12px;
  white-space: nowrap;
}

/* 响应式 */
@media screen and (max-width: 870px) {
  .container::before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }
  .container.sign-up-mode::before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }
  .form-warp {
    width: 100%;
    top: 75%;
    left: 50%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }
  .container.sign-up-mode .form-warp {
    top: 25%;
    left: 50%;
    transform: translate(-50%, 0);
  }
  img {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.7s;
  }
  .desc-warp {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }
  .desc-warp-item {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }
  .sign-in-desc {
    grid-row: 3 / 4;
  }

  .sign-in-desc img,
  .sign-in-desc .content {
    transform: translateY(800px);
  }

  .sign-up-mode .sign-in-desc img,
  .sign-up-mode .sign-in-desc .content {
    transform: translateY(0);
  }

  .sign-up-mode .sign-up-desc img,
  .sign-up-mode .sign-up-desc .content {
    transform: translateY(-800px);
  }
}

@media screen and (max-width: 570px) {
  .container::before {
    bottom: 72%;
    left: 50%;
  }
  img {
    display: none;
  }
}
</style>
