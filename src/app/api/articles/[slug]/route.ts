import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';
import { sql } from '@/lib/db';

// GET /api/articles/[slug] - Get single article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const result = await sql`
      SELECT * FROM articles WHERE slug = ${params.slug}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    return NextResponse.json(
      { data: result[0] },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: '获取文章失败', details: error.message }, { status: 500 });
  }
}

// PUT /api/articles/[slug] - Update article by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title_zh,
      title_en,
      slug,
      content_zh,
      content_en,
      excerpt_zh,
      excerpt_en,
      cover_image,
      category,
      tags,
      status,
      author
    } = body;

    // Check if article exists
    const existing = await sql`SELECT id FROM articles WHERE slug = ${params.slug}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== params.slug) {
      const slugCheck = await sql`
        SELECT id FROM articles WHERE slug = ${slug}
      `;
      if (slugCheck.length > 0) {
        return NextResponse.json({ error: 'slug已存在' }, { status: 400 });
      }
    }

    const tagsJson = tags ? JSON.stringify(tags) : null;
    const published_at = status === 'published' ? new Date().toISOString() : null;

    const result = await sql`
      UPDATE articles
      SET
        title_zh = ${title_zh},
        title_en = ${title_en || null},
        slug = ${slug || params.slug},
        content_zh = ${content_zh || null},
        content_en = ${content_en || null},
        excerpt_zh = ${excerpt_zh || null},
        excerpt_en = ${excerpt_en || null},
        cover_image = ${cover_image || null},
        category = ${category || null},
        tags = ${tagsJson},
        status = ${status},
        author = ${author || null},
        published_at = COALESCE(${published_at}, published_at),
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ${params.slug}
      RETURNING *
    `;

    return NextResponse.json({ data: result[0], message: '文章更新成功' });
  } catch (error: any) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: '更新文章失败', details: error.message }, { status: 500 });
  }
}

// DELETE /api/articles/[slug] - Delete article by slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 });
  }

  try {
    const result = await sql`
      DELETE FROM articles WHERE slug = ${params.slug} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    return NextResponse.json({ message: '文章删除成功' });
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: '删除文章失败', details: error.message }, { status: 500 });
  }
}
