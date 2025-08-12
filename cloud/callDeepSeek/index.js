const cloud = require('wx-server-sdk');
const OpenAI = require('openai');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const openai = new OpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey: "sk-0685f983b2d34d33a78756eb121f9c96" 
});

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是一个专业的瑶医医生，现在你是我的助理。" },
        { role: "user", content: event.userMessage }
      ]
    });

    console.log("API 响应:", response);

    if (response.choices && response.choices.length > 0) {
      return { reply: response.choices[0].message.content };
    } else {
      return { error: "AI 没有返回有效的回答" };
    }
  } catch (error) {
    console.error("API 调用失败:", error);
    return { error: error.message };
  }
};
