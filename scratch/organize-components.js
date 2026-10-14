const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '..', 'src', 'components');
const subdirs = [
  'common',
  'layout',
  'header',
  'footer',
  'navigation',
  'product',
  'category',
  'cart',
  'checkout',
  'order',
  'blog',
  'search',
  'auth',
  'profile',
  'forms'
];

subdirs.forEach(sd => {
  const p = path.join(componentsDir, sd);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
    // Write a .gitkeep or index.ts so git and TS recognize it
    fs.writeFileSync(path.join(p, 'index.ts'), `// ${sd} components export\n`, 'utf8');
  }
});

// Move existing unorganized components into common
const commonItems = ['Breadcrumbs', 'HeadActions', 'InlineSearch', 'PrescriptionUploadModal', 'ProductImage.tsx', 'TextBox'];
commonItems.forEach(item => {
  const oldP = path.join(componentsDir, item);
  const newP = path.join(componentsDir, 'common', item);
  if (fs.existsSync(oldP) && !fs.existsSync(newP)) {
    fs.renameSync(oldP, newP);
    console.log(`Moved component ${item} -> components/common/${item}`);
  }
});

// Update index.ts in common
const commonDir = path.join(componentsDir, 'common');
const commonItemsInDir = fs.readdirSync(commonDir).filter(f => f !== 'index.ts');
let commonIndex = '';
commonItemsInDir.forEach(item => {
  const baseName = item.replace(/\.tsx?$/, '');
  commonIndex += `export * from './${baseName}';\n`;
});
fs.writeFileSync(path.join(commonDir, 'index.ts'), commonIndex, 'utf8');

console.log('Components directory organized successfully.');
