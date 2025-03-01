const fs = require('fs');

// Fungsi untuk membaca dan memproses file
function processMDXFile(inputFilePath, outputFilePath) {
  // Baca isi file
  const fileContent = fs.readFileSync(inputFilePath, 'utf-8');

  // Filter dan proses hanya baris dengan awalan '#'
  let counter = 1; // Inisialisasi counter
  const updatedContent = fileContent.split('\n').filter(line => line.startsWith('# ')).map(line => {
    const title = line.slice(2).replace(/\n?\d{4}\.\d{2}\.\d{2}/, '').trim(); // Hapus '# ' dan tanggal
    const result = `### [${title}](./sayuri-yellow/photo/${counter})`;
    counter += 1; // Tambahkan counter
    return result;
  }).join('\n');

  // Tulis hasil ke file baru atau overwrite
  fs.writeFileSync(outputFilePath, updatedContent, 'utf-8');

  console.log(`File berhasil diproses dan disimpan ke: ${outputFilePath}`);
}

// Tentukan file input dan output
const inputFile = 'index.mdx'; // Ganti dengan path file Anda
const outputFile = 'index-updated.mdx'; // Ganti dengan nama file output jika diperlukan

// Jalankan fungsi
processMDXFile(inputFile, outputFile);