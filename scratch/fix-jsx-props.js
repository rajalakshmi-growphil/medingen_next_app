const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix fetchpriority -> fetchPriority
  content = content.replace(/fetchpriority=/g, 'fetchPriority=');
  
  // Fix class= inside JSX -> className=
  content = content.replace(/<([a-zA-Z0-9]+)\s+([^>]*)\bclass=([^>]*)/g, (match, tag, before, after) => {
    return `<${tag} ${before}className=${after}`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed JSX props in ${path.relative(srcDir, filePath)}`);
  }
});

console.log('JSX props fixed.');
