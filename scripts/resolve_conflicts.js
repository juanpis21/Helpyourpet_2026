const fs = require('fs');
const filePath = 'frontend/src/app/features/admin-modules/components/admin-modules.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /<<<<<<< Updated upstream\r?\n[\s\S]*?=======\r?\n([\s\S]*?)>>>>>>> Stashed changes\r?\n?/g;
content = content.replace(regex, '$1');

fs.writeFileSync(filePath, content);
console.log('Merge conflicts resolved successfully.');
