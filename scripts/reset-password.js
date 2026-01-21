const bcrypt = require('bcryptjs');

// 生成强密码
const newPassword = 'Admin@2026';

// 生成哈希
const hash = bcrypt.hashSync(newPassword, 10);

console.log('========================================');
console.log('         Neon 密码重置 SQL');
console.log('========================================\n');
console.log('新密码:', newPassword);
console.log('密码哈希:', hash);
console.log('\n----------------------------------------');
console.log('复制下面的 SQL 语句到 Neon 控制台执行:\n');
console.log(`UPDATE admins SET password_hash = '${hash}' WHERE username = 'admin';`);
console.log('\n----------------------------------------\n');
