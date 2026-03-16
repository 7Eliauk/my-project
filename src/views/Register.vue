<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { sendRegisterCode, register } from '../api/auth'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const email = ref('')
const registerCode = ref('')
const codeBtnDisabled = ref(false)
const codeError = ref('')
const emailError = ref('')
const countDown = ref(0)
const codeBtnText = ref('获取验证码')
const isLoading = ref(false)
const isRegistering = ref(false)

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
    codeError.value = error.message || '验证码发送失败，请稍后重试';
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
//注册验证
const handleRegister = async () => {
  if (
    !username.value ||
    !password.value ||
    !confirmPassword.value ||
    !email.value ||
    !registerCode.value
  ) {
    errorMessage.value = '请填写所有字段'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
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
      username: username.value,
      password: password.value,
      email: email.value,
      code: registerCode.value,
    })

    ElMessage.success('注册成功，请登录')

    // 注册成功后跳转到登录页面
    router.push('/login')
  } catch (error: any) {
    errorMessage.value = error.msg || '注册失败，请稍后重试'
  } finally {
    isRegistering.value = false
  }
}
// 验证密码是否匹配，在离开输入框时调用  validatePasswordMatch()手动密码校验函数
const validatePasswordMatch = () => {
  if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
  } else if (password.value && confirmPassword.value && password.value === confirmPassword.value) {
    errorMessage.value = ''
  }
}
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-background">
    <div class="register-container">
      <div class="register-card">
        <h2>智膳坊 - 注册</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="username">用户名</label>
            <input type="text" id="username" v-model="username" placeholder="请输入用户名" />
          </div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="请输入邮箱"
              @blur="validateEmail"
            />
            <p v-if="emailError" class="field-error">{{ emailError }}</p>
          </div>
          <div class="form-group code-group">
            <label for="register-code">注册验证码</label>
            <div class="code-input-wrapper">
              <input
                type="text"
                id="register-code"
                v-model="registerCode"
                placeholder="请输入注册验证码"
                @blur="validateCode"
              />
              <!-- 点击获取验证码 -->
              <span
                class="code-link"
                @click="sendCode"
                :class="{ disabled: codeBtnDisabled || isLoading }"
                :disabled="isLoading"
              >
                {{ isLoading ? '发送中...' : codeBtnText }}
              </span>
            </div>
            <p v-if="codeError" class="field-error">{{ codeError }}</p>
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="请输入密码"
              @blur="validatePasswordMatch"
            />
            <!-- 失去焦点时触发密码匹配校验 -->
          </div>
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="请再次输入密码"
              @blur="validatePasswordMatch"
            />
          </div>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <button type="submit" class="register-button" :disabled="isRegistering">
            {{ isRegistering ? '注册中...' : '注册' }}
          </button>
        </form>
        <div class="login-link">已有账号？<a href="#" @click.prevent="goToLogin">立即登录</a></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-background {
  background: url('../assets/1.jpg') no-repeat center center fixed;
  padding: 0;
  margin: 0;
  height: 100vh;
  background-size: cover;
}
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.register-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(25px);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 12px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #15688c;
  box-shadow: 0 0 0 2px rgba(107, 167, 236, 0.2);
}

.error-message {
  color: #f54444;
  margin-top: -15px;
  margin-bottom: 10px;
  font-size: 14px;
}

.register-button {
  width: 100%;
  padding: 14px;
  background: #072f8c;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.register-button:hover:not(:disabled) {
  background: #7094ea;
}

.register-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.login-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #4a7bec;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

/* 验证码相关样式 */
.code-input-wrapper {
  position: relative;
  width: 100%;
}

.code-input-wrapper input {
  padding-right: 120px;
}

.code-link {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #15688c;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: color 0.3s;
}

.code-link:hover:not(.disabled) {
  color: #8c9dc4;
}

.code-link.disabled {
  color: #ccc;
  cursor: not-allowed;
  text-decoration: none;
}

/* 字段级错误提示 */
.field-error {
  color: #f54444;
  margin-top: 5px;
  font-size: 12px;
  margin-bottom: 0;
}
</style>