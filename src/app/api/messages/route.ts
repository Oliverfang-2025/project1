import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';

const sql = neon(process.env.DATABASE_URL!);

/**
 * Helper function to check if a value has meaningful content
 * Replaces repetitive triple checks (null !== undefined !== '')
 */
function hasValue(val: string | null | undefined): boolean {
  return val !== null && val !== undefined && val !== '';
}

// GET /api/messages - Get messages list (requires auth)
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const read = searchParams.get('read');
    const replied = searchParams.get('replied');

    const offset = (page - 1) * limit;

    // Use tagged template for queries
    let result;
    let countResult;

    if (hasValue(read) && hasValue(replied)) {
      const isRead = read === 'true';
      const isReplied = replied === 'true';
      countResult = await sql`SELECT COUNT(*) as total FROM messages WHERE read = ${isRead} AND replied = ${isReplied}`;
      result = await sql`
        SELECT * FROM messages
        WHERE read = ${isRead} AND replied = ${isReplied}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (hasValue(read)) {
      const isRead = read === 'true';
      countResult = await sql`SELECT COUNT(*) as total FROM messages WHERE read = ${isRead}`;
      result = await sql`
        SELECT * FROM messages
        WHERE read = ${isRead}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (hasValue(replied)) {
      const isReplied = replied === 'true';
      countResult = await sql`SELECT COUNT(*) as total FROM messages WHERE replied = ${isReplied}`;
      result = await sql`
        SELECT * FROM messages
        WHERE replied = ${isReplied}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      countResult = await sql`SELECT COUNT(*) as total FROM messages`;
      result = await sql`
        SELECT * FROM messages
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const total = parseInt(countResult[0].total as string);

    // Get unread count
    const unreadResult = await sql`SELECT COUNT(*) as unread FROM messages WHERE read = false`;
    const unreadCount = parseInt(unreadResult[0].unread as string);

    return NextResponse.json({
      data: result,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: '获取消息列表失败', details: error.message }, { status: 500 });
  }
}

// POST /api/messages - Submit new message (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, content } = body;

    // Validate required fields
    if (!name || !email || !content) {
      return NextResponse.json({ error: '姓名、邮箱和内容不能为空' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '邮箱格式不正确' }, { status: 400 });
    }

    // Limit content length
    if (content.length > 5000) {
      return NextResponse.json({ error: '内容不能超过5000字符' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO messages (name, email, subject, content)
      VALUES (${name}, ${email}, ${subject || null}, ${content})
      RETURNING id, created_at
    `;

    return NextResponse.json({
      data: result[0],
      message: '消息发送成功，感谢您的留言！'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: '发送消息失败', details: error.message }, { status: 500 });
  }
}
