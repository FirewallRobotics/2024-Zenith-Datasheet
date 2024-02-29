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

async function main() {
  try {
    const list = await listFolders('.');
    const imagePath = path.join(__dirname, '2024pics', 'your_image.jpg'); // Replace "your_image.jpg" with actual image name

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Local Folders and Image</title>
      </head>
      <body>
        <h1>Local Folders</h1>
        <ul>
          ${list}
        </ul>
        <img src="${imagePath}" alt="Image from 2024pics folder">
      </body>
      </html>
    `;

    console.log(htmlContent); // Output HTML content for copy-pasting
  } catch (error) {
    console.error(error);
  }
}

main();
