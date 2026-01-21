const bcrypt = require('bcryptjs');

// 当前 Neon 数据库中的密码哈希（需要查询获取）
// 我们先测试两个可能的密码

const passwords = ['admin123', '@2026'];
const hashFromNeon = '$2b$10$q4SsaLbpbkODgze2u7OXQOzLbnUYWPDvNAOVW57InLD4Z45MJtDmS'; // 我们之前生成的 Admin@2026 哈希

console.log('========================================');
console.log('         密码验证测试');
console.log('========================================\n');

passwords.forEach(pwd => {
  const match = bcrypt.compareSync(pwd, hashFromNeon);
  console.log(`密码: ${pwd} -> ${match ? '✅ 匹配' : '❌ 不匹配'}`);
});

console.log('\n----------------------------------------');
console.log('如果不匹配，请在 Neon 控制台执行以下 SQL:');
console.log('UPDATE admins SET password_hash = \'$2b$10$q4SsaLbpbkODgze2u7OXQOzLbnUYWPDvNAOVW57InLD4Z45MJtDmS\' WHERE username = \'admin\';');
console.log('----------------------------------------\n');
