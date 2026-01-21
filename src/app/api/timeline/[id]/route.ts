import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/timeline/[id] - Get single timeline event by id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的ID' }, { status: 400 });
    }

    const result = await sql`
      SELECT * FROM timeline_events WHERE id = ${id}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: '时间线事件不存在' }, { status: 404 });
    }

    return NextResponse.json({ data: result[0] });
  } catch (error: any) {
    console.error('Error fetching timeline event:', error);
    return NextResponse.json({ error: '获取时间线事件失败', details: error.message }, { status: 500 });
  }
}

// PUT /api/timeline/[id] - Update timeline event (requires auth)
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

    // Check if event exists
    const existing = await sql`SELECT * FROM timeline_events WHERE id = ${id}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: '时间线事件不存在' }, { status: 404 });
    }

    const {
      title_zh,
      title_en,
      description_zh,
      description_en,
      date,
      type,
      sort_order
    } = body;

    // Validate type if provided
    if (type) {
      const validTypes = ['work', 'education', 'achievement'];
      if (!validTypes.includes(type)) {
        return NextResponse.json({ error: '无效的事件类型' }, { status: 400 });
      }
    }

    const result = await sql`
      UPDATE timeline_events SET
        title_zh = COALESCE(${title_zh}, title_zh),
        title_en = COALESCE(${title_en}, title_en),
        description_zh = COALESCE(${description_zh}, description_zh),
        description_en = COALESCE(${description_en}, description_en),
        date = COALESCE(${date}, date),
        type = COALESCE(${type}, type),
        sort_order = COALESCE(${sort_order}, sort_order)
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ data: result[0], message: '时间线事件更新成功' });
  } catch (error: any) {
    console.error('Error updating timeline event:', error);
    return NextResponse.json({ error: '更新时间线事件失败', details: error.message }, { status: 500 });
  }
}

// DELETE /api/timeline/[id] - Delete timeline event (requires auth)
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
      DELETE FROM timeline_events WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: '时间线事件不存在' }, { status: 404 });
    }

    return NextResponse.json({ message: '时间线事件删除成功' });
  } catch (error: any) {
    console.error('Error deleting timeline event:', error);
    return NextResponse.json({ error: '删除时间线事件失败', details: error.message }, { status: 500 });
  }
}
