import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/site-config - Get site configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    let result;

    if (key) {
      // Get specific config by key
      result = await sql`
        SELECT * FROM site_config WHERE key = ${key}
      `;

      if (result.length === 0) {
        return NextResponse.json({ error: '配置项不存在' }, { status: 404 });
      }

      return NextResponse.json(
        { data: result[0] },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    } else {
      // Get all configs
      result = await sql`
        SELECT * FROM site_config ORDER BY key
      `;

      // Transform to key-value object
      const config: Record<string, any> = {};
      result.forEach((item: any) => {
        config[item.key] = item.value;
      });

      return NextResponse.json(
        { data: config, raw: result },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    }
  } catch (error: any) {
    console.error('Error fetching site config:', error);
    return NextResponse.json({ error: '获取配置失败', details: error.message }, { status: 500 });
  }
}

// PUT /api/site-config - Update site configuration (requires auth)
export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, value } = body;

    // Validate required fields
    if (!key) {
      return NextResponse.json({ error: '配置项key不能为空' }, { status: 400 });
    }

    if (value === undefined) {
      return NextResponse.json({ error: '配置项value不能为空' }, { status: 400 });
    }

    // Upsert config
    const result = await sql`
      INSERT INTO site_config (key, value, updated_at)
      VALUES (${key}, ${JSON.stringify(value)}, CURRENT_TIMESTAMP)
      ON CONFLICT (key)
      DO UPDATE SET value = ${JSON.stringify(value)}, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    return NextResponse.json({ data: result[0], message: '配置更新成功' });
  } catch (error: any) {
    console.error('Error updating site config:', error);
    return NextResponse.json({ error: '更新配置失败', details: error.message }, { status: 500 });
  }
}

// POST /api/site-config - Batch update configurations (requires auth)
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 });
  }

  try {
    const body = await request.json();
    const { configs } = body;

    if (!configs || !Array.isArray(configs)) {
      return NextResponse.json({ error: '请提供配置项数组' }, { status: 400 });
    }

    const results = [];

    for (const config of configs) {
      const { key, value } = config;

      if (!key || value === undefined) continue;

      const result = await sql`
        INSERT INTO site_config (key, value, updated_at)
        VALUES (${key}, ${JSON.stringify(value)}, CURRENT_TIMESTAMP)
        ON CONFLICT (key)
        DO UPDATE SET value = ${JSON.stringify(value)}, updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;

      results.push(result[0]);
    }

    return NextResponse.json({
      data: results,
      message: `成功更新 ${results.length} 项配置`
    });
  } catch (error: any) {
    console.error('Error batch updating site config:', error);
    return NextResponse.json({ error: '批量更新配置失败', details: error.message }, { status: 500 });
  }
}

// DELETE /api/site-config - Delete configuration (requires auth)
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: '配置项key不能为空' }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM site_config WHERE key = ${key} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: '配置项不存在' }, { status: 404 });
    }

    return NextResponse.json({ message: '配置删除成功' });
  } catch (error: any) {
    console.error('Error deleting site config:', error);
    return NextResponse.json({ error: '删除配置失败', details: error.message }, { status: 500 });
  }
}
