import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/articles - Get article list with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Use tagged template for queries
    let result;
    let countResult;

    if (category && status && search) {
      countResult = await sql`SELECT COUNT(*) as total FROM articles WHERE category = ${category} AND status = ${status} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})`;
      result = await sql`
        SELECT id, title_zh, title_en, slug, excerpt_zh, excerpt_en, cover_image,
               category, tags, status, author, view_count, created_at, published_at
        FROM articles
        WHERE category = ${category} AND status = ${status} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (category && status) {
      countResult = await sql`SELECT COUNT(*) as total FROM articles WHERE category = ${category} AND status = ${status}`;
      result = await sql`
        SELECT id, title_zh, title_en, slug, excerpt_zh, excerpt_en, cover_image,
               category, tags, status, author, view_count, created_at, published_at
        FROM articles
        WHERE category = ${category} AND status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (category && search) {
      countResult = await sql`SELECT COUNT(*) as total FROM articles WHERE category = ${category} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})`;
      result = await sql`
        SELECT id, title_zh, title_en, slug, excerpt_zh, excerpt_en, cover_image,
               category, tags, status, author, view_count, created_at, published_at
        FROM articles
        WHERE category = ${category} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (status && search) {
      countResult = await sql`SELECT COUNT(*) as total FROM articles WHERE status = ${status} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})`;
      result = await sql`
        SELECT id, title_zh, title_en, slug, excerpt_zh, excerpt_en, cover_image,
               category, tags, status, author, view_count, created_at, published_at
        FROM articles
        WHERE status = ${status} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (category) {
      countResult = await sql`SELECT COUNT(*) as total FROM articles WHERE category = ${category}`;
      result = await sql`
        SELECT id, title_zh, title_en, slug, excerpt_zh, excerpt_en, cover_image,
               category, tags, status, author, view_count, created_at, published_at
        FROM articles
        WHERE category = ${category}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (status) {
      countResult = await sql`SELECT COUNT(*) as total FROM articles WHERE status = ${status}`;
      result = await sql`
        SELECT id, title_zh, title_en, slug, excerpt_zh, excerpt_en, cover_image,
               category, tags, status, author, view_count, created_at, published_at
        FROM articles
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (search) {
      countResult = await sql`SELECT COUNT(*) as total FROM articles WHERE title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'}`;
      result = await sql`
        SELECT id, title_zh, title_en, slug, excerpt_zh, excerpt_en, cover_image,
               category, tags, status, author, view_count, created_at, published_at
        FROM articles
        WHERE title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      countResult = await sql`SELECT COUNT(*) as total FROM articles`;
      result = await sql`
        SELECT id, title_zh, title_en, slug, excerpt_zh, excerpt_en, cover_image,
               category, tags, status, author, view_count, created_at, published_at
        FROM articles
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const total = parseInt(countResult[0].total as string);

    return NextResponse.json(
      {
        data: result,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: '获取文章列表失败', details: error.message }, { status: 500 });
  }
}

// POST /api/articles - Create new article (requires auth)
export async function POST(request: NextRequest) {
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
      tags = [],
      status = 'draft',
      author
    } = body;

    // Validate required fields
    if (!title_zh || !slug) {
      return NextResponse.json({ error: '标题和slug不能为空' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await sql`SELECT id FROM articles WHERE slug = ${slug}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'slug已存在' }, { status: 400 });
    }

    const published_at = status === 'published' ? new Date().toISOString() : null;
    const tagsJson = JSON.stringify(tags);

    const result = await sql`
      INSERT INTO articles (
        title_zh, title_en, slug, content_zh, content_en,
        excerpt_zh, excerpt_en, cover_image, category, tags,
        status, author, published_at
      ) VALUES (
        ${title_zh}, ${title_en || null}, ${slug}, ${content_zh || null}, ${content_en || null},
        ${excerpt_zh || null}, ${excerpt_en || null}, ${cover_image || null}, ${category || null}, ${tagsJson},
        ${status}, ${author || null}, ${published_at}
      )
      RETURNING *
    `;

    return NextResponse.json({ data: result[0], message: '文章创建成功' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: '创建文章失败', details: error.message }, { status: 500 });
  }
}
