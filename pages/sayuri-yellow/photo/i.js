const fs = require('fs');

// Path ke file
const filePath = './index.mdx';

// Line yang ingin ditambahkan di setiap akhir baris ke-2
const lineToAdd = '';

// Prefix '##' untuk setiap baris ke-1, 4, 7, dst.
const prefix = '#';

// Baca file secara asynchronous
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Pisahkan isi file menjadi array baris
  let lines = data.split('\n');

  // Balik urutan baris
  lines = lines.reverse();

  // Tambahkan baris baru di setiap akhir baris ke-2
  lines = lines.flatMap((line, index) => 
    (index + 1) % 2 === 0 ? [line, lineToAdd] : [line]
  );

  // Tambahkan '##' di setiap baris ke-1, 4, 7, dst.
  lines = lines.map((line, index) => 
    (index % 3 === 0 ? `${prefix} ${line}` : line)
  );

  // Gabungkan kembali baris menjadi string
  const updatedContent = lines.join('\n');

  // Tulis kembali ke file
  fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File successfully updated: reversed lines, added lines, and prefixed ##!');
    }
  });
});
