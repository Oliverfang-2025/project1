import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';
import { sql } from '@/lib/db';

// GET /api/projects/[slug] - Get single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const result = await sql`
      SELECT * FROM projects WHERE slug = ${params.slug}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
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
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: '获取项目失败', details: error.message }, { status: 500 });
  }
}

// PUT /api/projects/[slug] - Update project by slug
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
      description_zh,
      description_en,
      cover_image,
      tech_stack,
      demo_url,
      github_url,
      featured,
      status
    } = body;

    // Check if project exists
    const existing = await sql`SELECT id FROM projects WHERE slug = ${params.slug}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== params.slug) {
      const slugCheck = await sql`
        SELECT id FROM projects WHERE slug = ${slug}
      `;
      if (slugCheck.length > 0) {
        return NextResponse.json({ error: 'slug已存在' }, { status: 400 });
      }
    }

    const techStackJson = tech_stack ? JSON.stringify(tech_stack) : null;

    const result = await sql`
      UPDATE projects
      SET
        title_zh = ${title_zh},
        title_en = ${title_en || null},
        slug = ${slug || params.slug},
        description_zh = ${description_zh || null},
        description_en = ${description_en || null},
        cover_image = ${cover_image || null},
        tech_stack = ${techStackJson},
        demo_url = ${demo_url || null},
        github_url = ${github_url || null},
        featured = ${featured || false},
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ${params.slug}
      RETURNING *
    `;

    return NextResponse.json({ data: result[0], message: '项目更新成功' });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: '更新项目失败', details: error.message }, { status: 500 });
  }
}

// DELETE /api/projects/[slug] - Delete project by slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 });
  }

  try {
    const result = await sql`
      DELETE FROM projects WHERE slug = ${params.slug} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }

    return NextResponse.json({ message: '项目删除成功' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: '删除项目失败', details: error.message }, { status: 500 });
  }
}
