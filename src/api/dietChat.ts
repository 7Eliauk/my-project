import request from '../utils/request';

/**
 * 膳食助手对话接口（使用axios）
 * @param message 用户的问题
 * @param history 对话历史记录
 * @param callback 回调函数，用于处理流式响应
 * @returns Promise<void>
 */
export const dietChat = async (
  message: string, 
  history: { role: 'user' | 'assistant'; content: string }[], 
  callback: (text: string) => void
): Promise<void> => {
  try {
    const response = await request({
      url: '/api/ai/diet-chat',
      method: 'post', // 改为POST方法，因为需要传递对话历史
      data: {
        message,
        history
      },
      responseType: 'stream' // 使用流式响应
    });
    
    // 检查是否是流式响应
    if (typeof response.data === 'string') {
      // 处理非流式响应，模拟流式输出效果
      const lines = response.data.split('\n');
      
      return new Promise((resolve) => {
        let index = 0;
        
        const processNextLine = () => {
          if (index < lines.length) {
            const line = lines[index++];
            if (line && line.startsWith('data:')) {
              const text = line.substring(5);
              callback(text);
            }
            // 模拟流式输出的延迟
            setTimeout(processNextLine, 50);
          } else {
            resolve();
          }
        };
        
        processNextLine();
      });
    } else if (response.data && typeof response.data.on === 'function') {
      // 处理流式响应
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      
      response.data.on('data', (chunk: Uint8Array) => {
        buffer += decoder.decode(chunk);
        
        // 按行处理数据
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const text = line.substring(5);
            callback(text);
          }
        }
      });
      
      return new Promise((resolve, reject) => {
        response.data.on('end', resolve);
        response.data.on('error', reject);
      });
    } else {
      // 处理其他类型的响应
      console.error('Unexpected response data type:', typeof response.data);
      return Promise.reject(new Error('Unexpected response data type'));
    }
  } catch (error) {
    console.error('Diet chat error:', error);
    throw error;
  }
};

/**
 * 膳食助手对话接口（使用axios，返回Promise）
 * @param message 用户的问题
 * @param history 对话历史记录
 * @returns Promise<string> 完整的响应内容
 */
export const dietChatPromise = async (
  message: string, 
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> => {
  try {
    const data = await request({
      url: '/api/ai/diet-chat',
      method: 'post',
      data: {
        message,
        history
      }
    });
    
    // 处理带有 data: 前缀的响应
    if (typeof data === 'string') {
      const lines = (data as string).split('\n');
      let result = '';
      
      for (const line of lines) {
        if (line.startsWith('data:')) {
          result += line.substring(5);
        }
      }
      
      return result;
    }
    
    // 处理对象类型的响应，提取其中的文本内容
    if (data && typeof data === 'object') {
      // 如果是AxiosResponse，尝试获取data字段
      const responseData = data.data ?? data;
      if (typeof responseData === 'string') {
        return responseData;
      }
      // 如果是对象，尝试转换为字符串
      return JSON.stringify(responseData);
    }
    
    return String(data);
  } catch (error) {
    console.error('Diet chat error:', error);
    throw error;
  }
};


