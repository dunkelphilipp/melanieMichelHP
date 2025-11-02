/**
 * Clean Thumbnails Script
 * Removes all generated thumbnails (useful for testing/rebuilding)
 *
 * Usage: node clean-thumbnails.js
 */

const fs = require('fs').promises;
const path = require('path');

const config = {
    galleries: [
        'img/portfolio/wedding/weddingGal',
        'img/portfolio/event/eventGal',
        'img/portfolio/shooting/shootingGal'
    ],
    thumbnailSuffix: '-thumb'
};

let deletedCount = 0;

async function cleanGallery(galleryPath) {
    console.log(`\n📁 Cleaning: ${galleryPath}`);

    try {
        const files = await fs.readdir(galleryPath);
        const thumbnails = files.filter(file => file.includes(config.thumbnailSuffix));

        if (thumbnails.length === 0) {
            console.log('   No thumbnails found');
            return;
        }

        for (const thumb of thumbnails) {
            const thumbPath = path.join(galleryPath, thumb);
            await fs.unlink(thumbPath);
            console.log(`   ✓ Deleted: ${thumb}`);
            deletedCount++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }
}

async function main() {
    console.log('\n' + '═'.repeat(60));
    console.log('  🗑️  CLEAN THUMBNAILS');
    console.log('═'.repeat(60));

    for (const gallery of config.galleries) {
        await cleanGallery(gallery);
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`  Deleted ${deletedCount} thumbnail(s)`);
    console.log('═'.repeat(60) + '\n');
}

main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});