import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

// Initialize database - should be called once on first setup
export async function GET() {
  try {
    initDB();
    return NextResponse.json({ success: true, message: '数据库初始化成功' });
  } catch (error) {
    return NextResponse.json({ error: '数据库初始化失败' }, { status: 500 });
  }
}
