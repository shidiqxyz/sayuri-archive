const fs = require('fs');
const path = require('path');

// File sumber
const sourceFile = path.join(__dirname, 'index.mdx');

// Membaca isi file index.mdx
fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
        console.error(`Gagal membaca file: ${err.message}`);
        return;
    }

    // Memisahkan konten berdasarkan pola "## "
    const sections = data.split(/\n(?=# )/);

    // Menuliskan setiap bagian ke file baru
    sections.forEach((section, index) => {
        const fileName = `${index + 1}.mdx`;
        const filePath = path.join(__dirname, fileName);

        fs.writeFile(filePath, section.trim(), 'utf8', (err) => {
            if (err) {
                console.error(`Gagal menulis file ${fileName}: ${err.message}`);
            } else {
                console.log(`Berhasil membuat file ${fileName}`);
            }
        });
    });
});
