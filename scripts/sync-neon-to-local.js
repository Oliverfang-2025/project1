const { neon } = require('@neondatabase/serverless');
const { Pool } = require('pg');

// Neon 连接 (源)
const neonUrl = 'postgresql://neondb_owner:npg_jt6elUav1BSq@ep-odd-pond-ahmzg5vt-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const neonSql = neon(neonUrl);

// 本地 PostgreSQL 连接 (目标)
const localPool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'oliver_website',
  user: 'postgres',
  password: 'WWWwww123!'
});

// 表列表
const tables = [
  'admins',
  'articles',
  'projects',
  'site_config',
  'messages',
  'timeline_events'
];

async function syncTable(tableName) {
  console.log(`\n========================================`);
  console.log(`同步表: ${tableName}`);
  console.log(`========================================`);

  try {
    // 0. 先检查并创建表结构
    try {
      const checkResult = await localPool.query(`SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = '${tableName}'
      )`);

      if (checkResult.rows[0].exists === false) {
        console.log(`0. 本地表不存在，从 Neon 复制结构...`);

        // 从 Neon 获取表结构
        const createSql = await neonSql`
          SELECT 'CREATE TABLE ' || table_name || ' (' ||
          string_agg(
            column_name || ' ' || data_type ||
            CASE
              WHEN character_maximum_length IS NOT NULL THEN '(' || character_maximum_length || ')'
              WHEN numeric_precision IS NOT NULL AND numeric_scale IS NOT NULL THEN '(' || numeric_precision || ',' || numeric_scale || ')'
              ELSE ''
            END,
            ', '
          ) || ');'
          FROM information_schema.columns
          WHERE table_name = ${tableName}
          GROUP BY table_name
        `;

        if (createSql.length > 0) {
          await localPool.query(createSql[0].create);
          console.log(`   ✓ 表结构创建成功`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️  检查表结构失败:`, err.message);
    }

    // 1. 从 Neon 读取数据
    console.log(`1. 从 Neon 读取 ${tableName}...`);
    const data = await neonSql`SELECT * FROM ${tableName}`;
    console.log(`   ✓ 读取到 ${data.length} 条记录`);

    if (data.length === 0) {
      console.log(`   ⚠️  表为空，跳过`);
      return;
    }

    // 2. 清空本地表
    console.log(`2. 清空本地表 ${tableName}...`);
    await localPool.query(`DELETE FROM ${tableName}`);
    console.log(`   ✓ 清空完成`);

    // 3. 插入数据到本地
    console.log(`3. 插入数据到本地...`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const cols = [];
      const vals = [];

      for (const [key, value] of Object.entries(row)) {
        cols.push(`"${key}"`);
        vals.push(value);
      }

      const placeholders = vals.map((_, idx) => `$${idx + 1}`).join(', ');
      const query = `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${placeholders})`;

      try {
        await localPool.query(query, vals);
      } catch (err) {
        console.error(`   ✗ 第 ${i + 1} 条记录失败:`, err.message);
        if (i === 0) console.error(`   SQL:`, query);
        throw err;
      }
    }

    console.log(`   ✓ 插入 ${data.length} 条记录`);
    console.log(`\n✅ 表 ${tableName} 同步成功!`);

  } catch (error) {
    console.error(`\n❌ 表 ${tableName} 同步失败:`, error.message);
  }
}

async function main() {
  console.log('========================================');
  console.log('   Neon → 本地 PostgreSQL 数据同步');
  console.log('========================================');

  console.log('\n连接检查...');

  // 检查 Neon 连接
  try {
    const neonTest = await neonSql`SELECT 1`;
    console.log('✓ Neon 连接正常');
  } catch (error) {
    console.error('✗ Neon 连接失败:', error.message);
    process.exit(1);
  }

  // 检查本地连接
  try {
    await localPool.query('SELECT 1');
    console.log('✓ 本地连接正常');
  } catch (error) {
    console.error('✗ 本地连接失败:', error.message);
    console.log('\n请确保:');
    console.log('1. 本地 PostgreSQL 已安装并运行');
    console.log('2. 数据库 oliver_website 已创建');
    console.log('3. 密码是 WWWwww123!');
    process.exit(1);
  }

  console.log('\n开始同步...\n');

  // 同步所有表
  for (const table of tables) {
    await syncTable(table);
  }

  console.log('\n========================================');
  console.log('         同步完成!');
  console.log('========================================\n');

  await localPool.end();
}

main().catch(console.error);
