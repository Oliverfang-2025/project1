import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// POST /api/articles/[slug]/view - Increment article view count by slug
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const result = await sql`
      UPDATE articles
      SET view_count = view_count + 1
      WHERE slug = ${params.slug}
      RETURNING view_count
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    return NextResponse.json({ view_count: result[0].view_count });
  } catch (error: any) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json({ error: '更新浏览量失败', details: error.message }, { status: 500 });
  }
}
