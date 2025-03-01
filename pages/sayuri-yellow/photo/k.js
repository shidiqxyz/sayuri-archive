const fs = require('fs');
const path = require('path');

// Direktori kerja (tempat semua file MDX dan folder berada)
const baseDir = path.join(__dirname);

// Membaca semua file dengan ekstensi .mdx di direktori kerja
fs.readdir(baseDir, (err, files) => {
    if (err) {
        console.error(`Gagal membaca direktori: ${err.message}`);
        return;
    }

    // Filter hanya file MDX
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    mdxFiles.forEach(mdxFile => {
        const mdxPath = path.join(baseDir, mdxFile);

        // Baca isi file MDX
        fs.readFile(mdxPath, 'utf8', (err, content) => {
            if (err) {
                console.error(`Gagal membaca file ${mdxFile}: ${err.message}`);
                return;
            }

            // Nama folder berdasarkan nama file tanpa ekstensi
            const folderName = path.basename(mdxFile, '.mdx');
            const folderPath = path.join(baseDir, folderName);

            // Periksa apakah folder ada
            fs.readdir(folderPath, (err, images) => {
                if (err) {
                    console.error(`Gagal membaca folder ${folderName}: ${err.message}`);
                    return;
                }

                // Filter hanya file gambar (contoh: .jpg) dan urutkan berdasarkan angka
                const imageFiles = images
                    .filter(img => img.endsWith('.jpg'))
                    .sort((a, b) => {
                        const numA = parseInt(a.match(/\d+/)?.[0] || 0, 10);
                        const numB = parseInt(b.match(/\d+/)?.[0] || 0, 10);
                        return numA - numB;
                    });

                // Tambahkan referensi gambar ke konten MDX
                let updatedContent = content;
                imageFiles.forEach(image => {
                    const imagePath = `./${folderName}/${image}`;
                    updatedContent += `\n\n![${image}](${imagePath})`;
                });

                // Tulis ulang file MDX dengan konten baru
                fs.writeFile(mdxPath, updatedContent, 'utf8', err => {
                    if (err) {
                        console.error(`Gagal menulis file ${mdxFile}: ${err.message}`);
                    } else {
                        console.log(`Berhasil memperbarui file ${mdxFile}`);
                    }
                });
            });
        });
    });
});
