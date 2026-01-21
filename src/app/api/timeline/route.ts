import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';
import { sql } from '@/lib/db';

// GET /api/timeline - Get timeline events list
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');

    let result;

    if (type) {
      result = await sql`
        SELECT * FROM timeline_events
        WHERE type = ${type}
        ORDER BY date DESC, sort_order ASC
      `;
    } else {
      result = await sql`
        SELECT * FROM timeline_events
        ORDER BY date DESC, sort_order ASC
      `;
    }

    // Apply limit if specified
    const data = limit ? result.slice(0, parseInt(limit)) : result;

    return NextResponse.json(
      { data },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching timeline events:', error);
    return NextResponse.json({ error: '获取时间线失败', details: error.message }, { status: 500 });
  }
}

// POST /api/timeline - Create new timeline event (requires auth)
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title_zh,
      title_en,
      description_zh,
      description_en,
      date,
      type = 'work',
      sort_order = 0
    } = body;

    // Validate required fields
    if (!title_zh || !date) {
      return NextResponse.json({ error: '标题和日期不能为空' }, { status: 400 });
    }

    // Validate type
    const validTypes = ['work', 'education', 'achievement'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: '无效的事件类型' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO timeline_events (
        title_zh, title_en, description_zh, description_en, date, type, sort_order
      ) VALUES (
        ${title_zh}, ${title_en}, ${description_zh}, ${description_en}, ${date}, ${type}, ${sort_order}
      )
      RETURNING *
    `;

    return NextResponse.json({ data: result[0], message: '时间线事件创建成功' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating timeline event:', error);
    return NextResponse.json({ error: '创建时间线事件失败', details: error.message }, { status: 500 });
  }
}
