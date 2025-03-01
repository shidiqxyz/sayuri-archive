function generateGalleryLinks() {
    let galleries = [];

    // Add gallery links from 1 to 33
    galleries.push('# さユり GALLERY\n');
    for (let i = 1; i <= 33; i++) {
        galleries.push(`## さユり GALLERY vol.${i}\n![${i}](./${i}.jpeg)\n`);
    }

    return galleries;
}

// Generate and log the gallery links
const galleryLinks = generateGalleryLinks();
galleryLinks.forEach(link => console.log(link));