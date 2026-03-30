<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '../api/auth'

const router = useRouter()
const username = ref('') //vue3中ref创建响应式数据
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  // 简单的表单验证
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  try {
    isLoading.value = true
    // 调用登录API
    const response = await login({
      username: username.value,
      password: password.value,
    })

    // 登录成功，保存token和用户信息
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))

    ElMessage.success('登录成功')

    // 登录成功后跳转到主页
    router.push('/home')
  } catch (error: any) {
    // 处理不同类型的错误
    if (error.response) {
      // 服务器返回了错误响应
      errorMessage.value = error.response.data.msg || '登录失败，请检查用户名和密码'
    } else if (error.msg) {
      // 自定义错误对象
      errorMessage.value = error.msg
    } else {
      // 其他类型错误
      errorMessage.value = '登录失败，请检查用户名和密码'
    }
    ElMessage.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
  // router.push('/home')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-background">
    <div class="login-container">
      <div class="login-card">
        <h2>智膳坊 - 登录</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">用户名</label>
            <input type="text" id="username" v-model="username" placeholder="请输入用户名" />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input type="password" id="password" v-model="password" placeholder="请输入密码" />
          </div>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </form>
        <div class="register-link">
          还没有账号？<a href="#" @click.prevent="goToRegister">立即注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-background {
  background: url('../assets/1.jpg') no-repeat center center fixed;
  padding: 0;
  margin: 0;
  height: 100vh;
  background-size: cover;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-card {
  background: rgb(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 40px;
  border-radius: 20px;
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
  margin-bottom: 20px;
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
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #dfdfe2;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.error-message {
  color: #e74c3c;
  margin-bottom: 20px;
  font-size: 14px;
}

.login-button {
  width: 100%;
  padding: 14px;
  background: #2e509d;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.login-button:hover:not(:disabled) {
  background: #89a1eb;
}

.login-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #536080;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
