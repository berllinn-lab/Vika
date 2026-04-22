#!/usr/bin/env node
/* Usage: node scripts/hash.js "ваш_пароль" */
const bcrypt = require('bcryptjs');
const pwd = process.argv[2];
if (!pwd) {
  console.error('Usage: node scripts/hash.js "password"');
  process.exit(1);
}
bcrypt.hash(pwd, 10).then((h) => {
  console.log(h);
});
