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

  // Fix dashboard imports from other screens
  content = content.replace(/from (['"])\.\.\/Dashboard\//g, "from $1@/features/home/Dashboard/");
  content = content.replace(/from (['"])\.\.\/\.\.\/Dashboard\//g, "from $1@/features/home/Dashboard/");
  
  // Fix api/Api relative imports
  content = content.replace(/from (['"])\.\.\/api\/Api(['"])/g, "from $1@/api/Api$2");
  content = content.replace(/from (['"])\.\.\/\.\.\/api\/Api(['"])/g, "from $1@/api/Api$2");
  content = content.replace(/from (['"])\.\.\/\.\.\/\.\.\/api\/Api(['"])/g, "from $1@/api/Api$2");

  // Fix stateContext relative imports
  content = content.replace(/from (['"])\.\.\/api\/stateContext(['"])/g, "from $1@/api/stateContext$2");
  content = content.replace(/from (['"])\.\.\/\.\.\/api\/stateContext(['"])/g, "from $1@/api/stateContext$2");
  content = content.replace(/from (['"])\.\.\/\.\.\/\.\.\/api\/stateContext(['"])/g, "from $1@/api/stateContext$2");

  // Fix utils relative imports
  content = content.replace(/from (['"])\.\.\/utils\//g, "from $1@/utils/");
  content = content.replace(/from (['"])\.\.\/\.\.\/utils\//g, "from $1@/utils/");
  content = content.replace(/from (['"])\.\.\/\.\.\/\.\.\/utils\//g, "from $1@/utils/");

  // Fix components relative imports
  content = content.replace(/from (['"])\.\.\/components\//g, "from $1@/components/");
  content = content.replace(/from (['"])\.\.\/\.\.\/components\//g, "from $1@/components/");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed relative imports in ${path.relative(srcDir, filePath)}`);
  }
});

console.log('Relative imports fixed successfully.');
