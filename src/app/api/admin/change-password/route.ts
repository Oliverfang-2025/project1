import { NextRequest, NextResponse } from 'next/server';
import { initDB, changePassword } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initDB();
    const { username, oldPassword, newPassword } = await request.json();

    if (!username || !oldPassword || !newPassword) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '新密码至少需要6个字符' }, { status: 400 });
    }

    const success = await changePassword(username, oldPassword, newPassword);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: '原密码不正确' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: '修改密码失败' }, { status: 500 });
  }
}
