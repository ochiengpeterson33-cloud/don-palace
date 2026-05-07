import * as fs from 'fs';
import * as path from 'path';

function walk(dir: string, callback: (path: string) => void) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) walk(file, callback);
    else callback(file);
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-\[\#0A0A0A\]/g, 'bg-sand');
    content = content.replace(/text-\[\#F5F5F0\]/g, 'text-ink');
    content = content.replace(/bg-\[\#111111\]/g, 'bg-espresso');
    content = content.replace(/bg-\[\#1A1A1A\]/g, 'bg-olive');
    content = content.replace(/border-white/g, 'border-ink');
    // We will leave bg-white, text-white, bg-black, text-black alone to preserve high contrast elements like buttons.
    fs.writeFileSync(filePath, content);
  }
});
console.log('Done!');
