// React 和 Next.js 模块声明
declare module 'react';
declare module 'next/link';
declare module 'next/image';
declare module 'next/router';

// 允许引入图片和其他静态资源
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

declare module '*.gif' {
  const content: any;
  export default content;
}

declare module '*.webp' {
  const content: any;
  export default content;
}

declare module '*.ico' {
  const content: any;
  export default content;
}

declare module '*.css' {
  const content: any;
  export default content;
}

// 默认允许JSX
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
} 