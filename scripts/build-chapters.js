const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const chaptersDir = path.join(root, 'chapters');

const chapters = fs.readdirSync(chaptersDir)
  .filter(f => fs.statSync(path.join(chaptersDir, f)).isDirectory())
  .sort();

for (const ch of chapters) {
  const chapterRoot = path.join(chaptersDir, ch);
  const outDir = path.join(root, 'docs', `chapter${ch}`);
  const sourceOut = path.join(outDir, 'source');
  const base = `/phaser/chapter${ch}/`;

  console.log(`\nBuilding chapter ${ch}...`);
  execSync(
    `npx vite build "${chapterRoot}" --base "${base}" --outDir "${outDir}" --emptyOutDir`,
    { stdio: 'inherit', cwd: root }
  );

  // Copy source files so the switcher page can display them
  fs.mkdirSync(path.join(sourceOut, 'src'), { recursive: true });
  fs.copyFileSync(path.join(chapterRoot, 'index.html'), path.join(sourceOut, 'index.html'));
  const srcFiles = fs.readdirSync(path.join(chapterRoot, 'src'));
  for (const file of srcFiles) {
    fs.copyFileSync(
      path.join(chapterRoot, 'src', file),
      path.join(sourceOut, 'src', file)
    );
  }
  console.log(`  Source files copied to docs/chapter${ch}/source/`);
}

console.log('\nAll chapters built.');
