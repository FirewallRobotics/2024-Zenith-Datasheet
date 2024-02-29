const fs = require('fs').promises;
const path = require('path');

async function listFolders(dir) {
  const subdirs = await fs.readdir(dir);

  const filteredSubdirs = subdirs.filter(item => ![".git", "index.html"].includes(item));

  const listItems = await Promise.all(filteredSubdirs.map(async subdir => {
    const fullPath = path.join(dir, subdir);
    const stats = await fs.lstat(fullPath);

    if (stats.isDirectory()) {
      const files = await listFolders(fullPath);
      return `
        <li>
          <a href="${subdir}">${subdir}</a>
          <ul>
            ${files}
          </ul>
        </li>
      `;
    } else if (path.extname(subdir) === '.pdf') { // Check for PDF extension
      return `<li><a href="${fullPath}">${subdir}</a></li>`; // Link to full path
    } else {
      return `<li>${subdir}</li>`; // Only list file names, not links
    }
  }));

  return listItems.join('');
}

(async () => {
  try {
    const list = await listFolders('.');
    console.log(list);
  } catch (error) {
    console.error(error);
  }
})();
