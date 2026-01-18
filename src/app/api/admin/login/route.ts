import { NextRequest, NextResponse } from 'next/server';
import { initDB, verifyLogin } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initDB();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: '用户名和密码不能为空' }, { status: 400 });
    }

    const isValid = await verifyLogin(username, password);

    if (isValid) {
      return NextResponse.json({
        success: true,
        username
      });
    } else {
      return NextResponse.json({ error: '用户名或密码不正确' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}
