const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const commonComponents = [
  'Breadcrumbs',
  'HeadActions',
  'InlineSearch',
  'PrescriptionUploadModal',
  'ProductImage',
  'TextBox'
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.js')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  commonComponents.forEach(comp => {
    const r1 = new RegExp(`@/components/${comp}/`, 'g');
    content = content.replace(r1, `@/components/common/${comp}/`);

    const r2 = new RegExp(`@/components/${comp}(['";])`, 'g');
    content = content.replace(r2, `@/components/common/${comp}$1`);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated component imports in ${path.relative(srcDir, filePath)}`);
  }
});

console.log('Component imports updated.');
