"use client";

import React, { useEffect, useRef } from 'react';

const DifyChat = () => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    
    // 添加自定义样式
    const style = document.createElement('style');
    style.innerHTML = `
      #dify-chatbot-bubble-button {
        background-color: #1C64F2 !important;
      }
      #dify-chatbot-bubble-window {
        width: 24rem !important;
        height: 36rem !important;
      }
    `;
    document.head.appendChild(style);

    // 配置Dify
    window.difyChatbotConfig = {
      token: 'uluSs0xDCF8cY734',
      serverUrl: 'https://udify.app',
      systemVariables: {},
    };

    // 加载Dify脚本
    const script = document.createElement('script');
    script.src = "https://udify.app/embed.min.js";
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