<template>
  <div class="diet-assistant-container">
    <!-- 顶部导航 -->
    <HeaderSec />
    
    <!-- 主内容区 -->
    <div class="chat-container">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <div class="chat-header-content">
          <div class="assistant-avatar">
            <svg class="avatar-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="chat-header-info">
            <h2 class="chat-title">膳食助手</h2>
            <p class="chat-subtitle">您的AI营养师，随时为您解答饮食健康问题</p>
          </div>
        </div>
      </div>
      
      <!-- 聊天内容区 -->
      <div class="chat-body" ref="chatBody">
        <el-scrollbar>
          <div class="message-list">
            <div 
              v-for="(message, index) in messages" 
              :key="index"
              :class="['message', message.type]"
            >
              <div v-if="message.type === 'assistant'" class="message-avatar">
                <el-avatar :size="36" class="assistant-avatar-small">
                  <svg class="avatar-icon small" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </el-avatar>
              </div>
              <el-card 
                :class="['message-content', message.type === 'user' ? 'user-message' : 'assistant-message']"
                :body-style="{ padding: '16px 20px' }"
              >
                {{ message.content }}
              </el-card>
              <div v-if="message.type === 'user'" class="message-avatar">
                <el-avatar :size="36" class="user-avatar">
                  <el-icon class="user-icon"><User /></el-icon>
                </el-avatar>
              </div>
            </div>
            <div v-if="isLoading" class="loading-indicator">
              <el-skeleton :rows="1" animated>
                <template #template>
                  <div class="loading-content">
                    <el-icon class="is-loading"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0zm0 960a448 448 0 1 1 448-448 448 448 0 0 1-448 448z" fill="currentColor"/><path d="M512 160a352 352 0 0 1 352 352c0 19.2-15.5 34.7-34.7 34.7H477.3A34.7 34.7 0 0 1 442.7 512c0-192 154-346 346-346z" fill="currentColor"/></svg></el-icon>
                    <span>正在思考...</span>
                  </div>
                </template>
              </el-skeleton>
            </div>
          </div>
        </el-scrollbar>
      </div>
      
      <!-- 输入区域 -->
      <div class="chat-input-area">
        <el-card :body-style="{ padding: '20px' }" class="input-card">
          <el-input
            v-model="userInput"
            placeholder="请输入您的饮食健康问题，例如：减脂早餐吃什么？"
            @keyup.enter="sendMessage"
            :disabled="isLoading"
            type="textarea"
            :rows="3"
            resize="none"
            class="chat-textarea"
          >
            <template #append>
              <el-button 
                type="primary" 
                @click="sendMessage"
                :disabled="isLoading || !userInput.trim()"
                class="send-button"
                :icon="Send"
              >
                发送
              </el-button>
            </template>
          </el-input>
          <div class="input-hint">
            <span>💡 提示：您可以询问减脂食谱、营养搭配、饮食建议等问题</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import HeaderSec from '@/components/HeaderSection.vue';
import { User } from '@element-plus/icons-vue';
import { dietChat } from '@/api/dietChat';

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

const messages = ref<Message[]>([
  {
    type: 'assistant',
    content: '您好！我是您的AI营养师，有什么饮食健康问题可以咨询我？'
  }
]);
const userInput = ref('');
const isLoading = ref(false);
const chatBody = ref<HTMLElement | null>(null);

// 对话历史记录（最多保存10轮对话）
const getConversationHistory = (): { role: 'user' | 'assistant'; content: string }[] => {
  // 转换messages为后端需要的格式
  return messages.value.map(msg => ({
    role: msg.type,
    content: msg.content
  }));
};

// 限制对话历史为最近10轮（20条消息，每条消息算一轮的一半）
const limitConversationHistory = (history: { role: 'user' | 'assistant'; content: string }[]) => {
  // 确保对话历史是偶数条（用户和助手各一条）
  const maxLength = 20; // 10轮对话
  if (history.length > maxLength) {
    // 保留最近的10轮对话
    return history.slice(-maxLength);
  }
  return history;
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight;
  }
};

const sendMessage = async () => {
  const message = userInput.value.trim();
  if (!message || isLoading.value) return;
  
  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: message
  });
  userInput.value = '';
  await scrollToBottom();
  
  // 开始加载
  isLoading.value = true;
  
  try {
    let assistantMessage = '';
    let messageIndex: number | null = null;
    
    // 获取对话历史记录并限制为10轮
    const conversationHistory = limitConversationHistory(getConversationHistory());
    
    // 调用膳食助手API
    await dietChat(message, conversationHistory, (text) => {
      // 当收到第一个响应时，添加助手消息
      if (messageIndex === null) {
        messageIndex = messages.value.length;
        messages.value.push({
          type: 'assistant',
          content: ''
        });
      }
      
      assistantMessage += text;
      if (messageIndex !== null && messages.value[messageIndex]) {
        if (messages.value[messageIndex]) {
          messages.value[messageIndex]!.content = assistantMessage;
        }
      }
      scrollToBottom();
    });
  } catch (error) {
    console.error('Error:', error);
    messages.value.push({
      type: 'assistant',
      content: '抱歉，服务暂时不可用，请稍后再试。'
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.diet-assistant-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fdf8 0%, #ffffff 100%);
}

.chat-container {
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 40px;
  background: white;
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(76, 175, 80, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 85vh;
}

.chat-header {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  padding: 24px;
  border-bottom: 1px solid rgba(245, 124, 0, 0.1);
}

.chat-header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.assistant-avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 12px rgba(245, 124, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.assistant-avatar-small {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%) !important;
  border: 1px solid rgba(245, 124, 0, 0.2);
}

.avatar-icon {
  width: 32px;
  height: 32px;
  color: white;
}

.avatar-icon.small {
  width: 24px;
  height: 24px;
  color: #ff9800;
}

.chat-header-info {
  flex: 1;
}

.chat-title {
  margin: 0 0 8px 0;
  color: #f57c00;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.chat-subtitle {
  margin: 0;
  color: #ff9800;
  font-size: 14px;
  opacity: 0.8;
}

.chat-body {
  flex: 1;
  overflow: hidden;
  background: #fafafa;
}

:deep(.el-scrollbar) {
  height: 100%;
}

:deep(.el-scrollbar__wrap) {
  padding: 24px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  animation: fadeIn 0.3s ease;
}

.message.assistant {
  flex-direction: row;
  justify-content: flex-start;
}

.message.user {
  flex-direction: row;
  justify-content: flex-end;
}

.message-avatar {
  flex-shrink: 0;
  margin-top: 4px;
}

.user-avatar {
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%) !important;
  color: white !important;
}

.user-icon {
  font-size: 18px;
}

.message-content {
  max-width: 70%;
  border-radius: 18px;
  line-height: 1.5;
  word-wrap: break-word;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.message-content:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.user-message {
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%) !important;
  color: white;
  border-bottom-right-radius: 4px !important;
  border-top-right-radius: 18px !important;
  border-top-left-radius: 18px !important;
  border-bottom-left-radius: 18px !important;
}

.assistant-message {
  background: white !important;
  color: #303133;
  border-bottom-left-radius: 4px !important;
  border-top-right-radius: 18px !important;
  border-top-left-radius: 18px !important;
  border-bottom-right-radius: 18px !important;
}

:deep(.user-message .el-card__body) {
  color: white !important;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  margin-top: 8px;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff9800;
  font-size: 14px;
  background: rgba(255, 152, 0, 0.05);
  padding: 12px 20px;
  border-radius: 12px;
  width: 100%;
  justify-content: center;
}

.loading-content .el-icon {
  font-size: 16px;
}

.chat-input-area {
  padding: 24px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.input-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: none;
}

.input-card:hover {
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.15);
}

.chat-textarea {
  border-radius: 10px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.chat-textarea:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

:deep(.el-textarea__inner) {
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
}

.send-button {
  border-radius: 10px;
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  border: none;
  transition: all 0.3s ease;
  padding: 0 24px;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
}

.send-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #43a047 0%, #388e3c 100%);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transform: translateY(-1px);
}

.input-hint {
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .diet-assistant-container {
    padding: 0 10px;
  }
  
  .chat-container {
    margin: 10px 0;
    min-height: 85vh;
    max-width: 100%;
  }
  
  .chat-header {
    padding: 16px;
  }
  
  :deep(.el-scrollbar__wrap) {
    padding: 16px;
  }
  
  .chat-input-area {
    padding: 16px;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .assistant-avatar {
    width: 48px;
    height: 48px;
  }
  
  .avatar-icon {
    width: 28px;
    height: 28px;
  }
  
  .message {
    gap: 12px;
  }
  
  .message-list {
    gap: 16px;
  }
}
</style>