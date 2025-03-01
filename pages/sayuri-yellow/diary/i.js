const fs = require('fs');
const path = require('path');

const directoryPath = './'; // Direktori saat ini
const result = {};

// Fungsi untuk memproses file MDX
const processFiles = () => {
    const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.mdx'));
    
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        
        // Ambil baris kedua dan hapus simbol #
        if (lines.length > 1) {
            const lineTwo = lines[1].replace(/#/g, '').trim();
            const fileNumber = path.basename(file, '.mdx'); // Ambil nomor file dari nama
            result[fileNumber] = lineTwo;
        }
    });

    // Custom console log output
    for (const [key, value] of Object.entries(result)) {
        console.log(`${key}: "${value}",`);
    }
};

processFiles();
