const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, '..', 'src', 'features');

const features = fs.readdirSync(featuresDir).filter(f => fs.statSync(path.join(featuresDir, f)).isDirectory());

features.forEach(feat => {
  const fDir = path.join(featuresDir, feat);
  const subdirs = fs.readdirSync(fDir).filter(f => fs.statSync(path.join(fDir, f)).isDirectory());

  let indexContent = '';
  subdirs.forEach(sd => {
    const sdPath = path.join(fDir, sd);
    const files = fs.readdirSync(sdPath).filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
    files.forEach(file => {
      const baseName = file.replace(/\.tsx?$/, '');
      indexContent += `export * from './${sd}/${baseName}';\n`;
    });
  });

  fs.writeFileSync(path.join(fDir, 'index.ts'), indexContent, 'utf8');
  console.log(`Updated index.ts for feature: ${feat}`);
});

console.log('Feature index files updated.');
