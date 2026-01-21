import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/messages/[id] - Get single message (requires auth)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 });
  }

  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的ID' }, { status: 400 });
    }

    const result = await sql`
      SELECT * FROM messages WHERE id = ${id}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: '消息不存在' }, { status: 404 });
    }

    return NextResponse.json({ data: result[0] });
  } catch (error: any) {
    console.error('Error fetching message:', error);
    return NextResponse.json({ error: '获取消息失败', details: error.message }, { status: 500 });
  }
}

// PUT /api/messages/[id] - Update message status (requires auth)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 });
  }

  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的ID' }, { status: 400 });
    }

    const body = await request.json();

    // Check if message exists
    const existing = await sql`SELECT * FROM messages WHERE id = ${id}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: '消息不存在' }, { status: 404 });
    }

    const { read, replied } = body;

    // Update based on provided fields
    let result;
    if (read !== undefined && replied !== undefined) {
      result = await sql`UPDATE messages SET read = ${read}, replied = ${replied} WHERE id = ${id} RETURNING *`;
    } else if (read !== undefined) {
      result = await sql`UPDATE messages SET read = ${read} WHERE id = ${id} RETURNING *`;
    } else if (replied !== undefined) {
      result = await sql`UPDATE messages SET replied = ${replied} WHERE id = ${id} RETURNING *`;
    } else {
      return NextResponse.json({ error: '没有要更新的字段' }, { status: 400 });
    }

    return NextResponse.json({ data: result[0], message: '消息状态更新成功' });
  } catch (error: any) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: '更新消息失败', details: error.message }, { status: 500 });
  }
}

// DELETE /api/messages/[id] - Delete message (requires auth)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 });
  }

  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的ID' }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM messages WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: '消息不存在' }, { status: 404 });
    }

    return NextResponse.json({ message: '消息删除成功' });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: '删除消息失败', details: error.message }, { status: 500 });
  }
}
