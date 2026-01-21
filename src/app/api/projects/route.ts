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

// GET /api/projects - Get project list with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Use tagged template for queries
    let result;
    let countResult;

    if (hasValue(status) && hasValue(featured) && hasValue(search)) {
      const isFeatured = featured === 'true';
      countResult = await sql`SELECT COUNT(*) as total FROM projects WHERE status = ${status} AND featured = ${isFeatured} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})`;
      result = await sql`
        SELECT * FROM projects
        WHERE status = ${status} AND featured = ${isFeatured} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})
        ORDER BY featured DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (hasValue(status) && hasValue(featured)) {
      const isFeatured = featured === 'true';
      countResult = await sql`SELECT COUNT(*) as total FROM projects WHERE status = ${status} AND featured = ${isFeatured}`;
      result = await sql`
        SELECT * FROM projects
        WHERE status = ${status} AND featured = ${isFeatured}
        ORDER BY featured DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (hasValue(status) && hasValue(search)) {
      countResult = await sql`SELECT COUNT(*) as total FROM projects WHERE status = ${status} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})`;
      result = await sql`
        SELECT * FROM projects
        WHERE status = ${status} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})
        ORDER BY featured DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (hasValue(featured) && hasValue(search)) {
      const isFeatured = featured === 'true';
      countResult = await sql`SELECT COUNT(*) as total FROM projects WHERE featured = ${isFeatured} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})`;
      result = await sql`
        SELECT * FROM projects
        WHERE featured = ${isFeatured} AND (title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'})
        ORDER BY featured DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (hasValue(status)) {
      countResult = await sql`SELECT COUNT(*) as total FROM projects WHERE status = ${status}`;
      result = await sql`
        SELECT * FROM projects
        WHERE status = ${status}
        ORDER BY featured DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (hasValue(featured)) {
      const isFeatured = featured === 'true';
      countResult = await sql`SELECT COUNT(*) as total FROM projects WHERE featured = ${isFeatured}`;
      result = await sql`
        SELECT * FROM projects
        WHERE featured = ${isFeatured}
        ORDER BY featured DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (hasValue(search)) {
      countResult = await sql`SELECT COUNT(*) as total FROM projects WHERE title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'}`;
      result = await sql`
        SELECT * FROM projects
        WHERE title_zh ILIKE ${'%' + search + '%'} OR title_en ILIKE ${'%' + search + '%'}
        ORDER BY featured DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      countResult = await sql`SELECT COUNT(*) as total FROM projects`;
      result = await sql`
        SELECT * FROM projects
        ORDER BY featured DESC, created_at DESC
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
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: '获取项目列表失败', details: error.message }, { status: 500 });
  }
}

// POST /api/projects - Create new project (requires auth)
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
      description_zh,
      description_en,
      cover_image,
      tech_stack = [],
      demo_url,
      github_url,
      featured = false,
      status = 'draft'
    } = body;

    // Validate required fields
    if (!title_zh || !slug) {
      return NextResponse.json({ error: '标题和slug不能为空' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await sql`SELECT id FROM projects WHERE slug = ${slug}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'slug已存在' }, { status: 400 });
    }

    const techStackJson = JSON.stringify(tech_stack);

    const result = await sql`
      INSERT INTO projects (
        title_zh, title_en, slug, description_zh, description_en,
        cover_image, tech_stack, demo_url, github_url, featured, status
      ) VALUES (
        ${title_zh}, ${title_en || null}, ${slug}, ${description_zh || null}, ${description_en || null},
        ${cover_image || null}, ${techStackJson}, ${demo_url || null}, ${github_url || null}, ${featured}, ${status}
      )
      RETURNING *
    `;

    return NextResponse.json({ data: result[0], message: '项目创建成功' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: '创建项目失败', details: error.message }, { status: 500 });
  }
}
