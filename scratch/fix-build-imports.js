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

  // Fix App page imports pointing to old screens
  content = content.replace(/from (['"])\.\.\/\.\.\/screens\/LandingPage\/LandingPage(['"])/g, "from $1@/features/cart/LandingPage/LandingPage$2");
  content = content.replace(/from (['"])\.\.\/\.\.\/screens\//g, "from $1@/features/");
  content = content.replace(/from (['"])\.\.\/screens\//g, "from $1@/features/");
  content = content.replace(/from (['"])@\/screens\//g, "from $1@/features/");

  // Fix feature-to-feature cross references
  content = content.replace(/from (['"])\.\.\/OrderProgressConfirmation\/OrderProgressConfirmation(['"])/g, "from $1@/features/orders/OrderProgressConfirmation/OrderProgressConfirmation$2");

  // Fix components/common references
  content = content.replace(/from (['"])@\/components\/HeadActions\//g, "from $1@/components/common/HeadActions/");
  content = content.replace(/from (['"])@\/components\/HeadActions(['"])/g, "from $1@/components/common/HeadActions$2");
  content = content.replace(/from (['"])@\/components\/InlineSearch\//g, "from $1@/components/common/InlineSearch/");
  content = content.replace(/from (['"])@\/components\/InlineSearch(['"])/g, "from $1@/components/common/InlineSearch$2");
  content = content.replace(/from (['"])@\/components\/Breadcrumbs\//g, "from $1@/components/common/Breadcrumbs/");
  content = content.replace(/from (['"])@\/components\/Breadcrumbs(['"])/g, "from $1@/components/common/Breadcrumbs$2");
  content = content.replace(/from (['"])@\/components\/TextBox\//g, "from $1@/components/common/TextBox/");
  content = content.replace(/from (['"])@\/components\/TextBox(['"])/g, "from $1@/components/common/TextBox$2");
  content = content.replace(/from (['"])@\/components\/PrescriptionUploadModal\//g, "from $1@/components/common/PrescriptionUploadModal/");
  content = content.replace(/from (['"])@\/components\/PrescriptionUploadModal(['"])/g, "from $1@/components/common/PrescriptionUploadModal$2");
  content = content.replace(/from (['"])@\/components\/ProductImage(['"])/g, "from $1@/components/common/ProductImage$2");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${path.relative(srcDir, filePath)}`);
  }
});

console.log('Fix build imports script completed.');
