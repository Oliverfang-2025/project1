"use client";

import React, { useEffect, useRef } from 'react';

// Dify配置信息
// 注意：当您在Dify平台上更新机器人设置后，可能需要清除浏览器缓存或强制刷新页面
// 如果更改了token或serverUrl，需要更新以下常量并重新部署网站
const DIFY_CONFIG = {
  token: 'uluSs0xDCF8cY734', // 替换为你从Dify平台获取的新chatflow的API密钥
  serverUrl: 'https://udify.app', // 确认这是正确的API基础URL，如有变更请更新
  systemVariables: {
    // 如果你的chatflow使用了系统变量，可以在这里添加
    // 例如：user_id: '用户ID',
    // 例如：user_name: '用户名称',
  },
  // 不要手动设置botName，使用Dify平台设置的名称
  // 以下参数将从Dify平台获取：名称、头像、问候语等
};

// 自定义样式设置
const CUSTOM_STYLES = `
  #dify-chatbot-bubble-button {
    background-color: #1C64F2 !important;
  }
  #dify-chatbot-bubble-window {
    min-width: 24rem !important;
    min-height: 36rem !important;
    resize: both !important;
    overflow: auto !important;
  }
`;

const DifyChat = () => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    
    // 添加自定义样式
    const style = document.createElement('style');
    style.innerHTML = CUSTOM_STYLES;
    document.head.appendChild(style);

    // 配置Dify
    window.difyChatbotConfig = DIFY_CONFIG;

    // 加载Dify脚本
    const script = document.createElement('script');
    script.src = `${DIFY_CONFIG.serverUrl}/embed.min.js`;
    script.id = "dify-script";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    scriptLoaded.current = true;

    // 清理函数
    return () => {
      document.head.removeChild(style);
      const scriptToRemove = document.getElementById("dify-script");
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    };
  }, []);

  return null;
};

// 添加Window类型定义
declare global {
  interface Window {
    difyChatbotConfig: {
      token: string;
      serverUrl?: string;
      systemVariables: Record<string, any>;
    };
  }
}

export default DifyChat; 