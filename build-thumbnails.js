/**
 * Automatic Thumbnail Generator
 * Generates optimized thumbnails for gallery images
 *
 * Usage: node build-thumbnails.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
    galleries: [
        'img/portfolio/wedding/weddingGal',
        'img/portfolio/event/eventGal',
        'img/portfolio/shooting/shootingGal'
    ],
    thumbnailWidth: 600,        // Width in pixels
    thumbnailQuality: 85,        // WebP quality (1-100)
    thumbnailSuffix: '-thumb',   // Suffix for thumbnail files
    imageExtensions: ['.webp', '.jpg', '.jpeg', '.png']
};

// Statistics
let stats = {
    processed: 0,
    created: 0,
    skipped: 0,
    errors: 0
};

/**
 * Check if file is an image
 */
function isImageFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return config.imageExtensions.includes(ext) &&
        !filename.includes(config.thumbnailSuffix);
}

/**
 * Get thumbnail filename
 */
function getThumbnailFilename(originalFile) {
    const ext = path.extname(originalFile);
    const basename = path.basename(originalFile, ext);
    return `${basename}${config.thumbnailSuffix}.webp`;
}

/**
 * Generate thumbnail for a single image
 */
async function generateThumbnail(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .resize(config.thumbnailWidth, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .webp({
                quality: config.thumbnailQuality,
                effort: 6  // Higher effort = better compression
            })
            .toFile(outputPath);

        return true;
    } catch (error) {
        console.error(`   ❌ Error creating thumbnail: ${error.message}`);
        return false;
    }
}

/**
 * Get file size in KB
 */
async function getFileSize(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return (stats.size / 1024).toFixed(2);
    } catch {
        return 0;
    }
}

/**
 * Process a single gallery directory
 */
async function processGallery(galleryPath) {
    console.log(`\n📁 Processing gallery: ${galleryPath}`);
    console.log('─'.repeat(60));

    try {
        // Check if directory exists
        await fs.access(galleryPath);

        // Read all files in directory
        const files = await fs.readdir(galleryPath);
        const imageFiles = files.filter(isImageFile);

        if (imageFiles.length === 0) {
            console.log('   ⚠️  No images found in this gallery');
            return;
        }

        console.log(`   Found ${imageFiles.length} images to process\n`);

        // Process each image
        for (const file of imageFiles) {
            stats.processed++;

            const inputPath = path.join(galleryPath, file);
            const thumbnailFile = getThumbnailFilename(file);
            const outputPath = path.join(galleryPath, thumbnailFile);

            // Check if thumbnail already exists
            try {
                await fs.access(outputPath);
                const thumbSize = await getFileSize(outputPath);
                console.log(`   ✓ Exists: ${thumbnailFile} (${thumbSize} KB)`);
                stats.skipped++;
                continue;
            } catch {
                // Thumbnail doesn't exist, create it
            }

            // Generate thumbnail
            const originalSize = await getFileSize(inputPath);
            const success = await generateThumbnail(inputPath, outputPath);

            if (success) {
                const thumbSize = await getFileSize(outputPath);
                const reduction = ((1 - thumbSize / originalSize) * 100).toFixed(1);
                console.log(`   ✓ Created: ${thumbnailFile}`);
                console.log(`      ${originalSize} KB → ${thumbSize} KB (${reduction}% smaller)`);
                stats.created++;
            } else {
                stats.errors++;
            }
        }

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`   ❌ Directory not found: ${galleryPath}`);
        } else {
            console.log(`   ❌ Error processing gallery: ${error.message}`);
        }
        stats.errors++;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('\n' + '═'.repeat(60));
    console.log('  🖼️  THUMBNAIL GENERATOR');
    console.log('═'.repeat(60));
    console.log(`  Configuration:`);
    console.log(`  • Thumbnail width: ${config.thumbnailWidth}px`);
    console.log(`  • Quality: ${config.thumbnailQuality}%`);
    console.log(`  • Suffix: ${config.thumbnailSuffix}`);
    console.log('═'.repeat(60));

    const startTime = Date.now();

    // Process each gallery
    for (const gallery of config.galleries) {
        await processGallery(gallery);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Print summary
    console.log('\n' + '═'.repeat(60));
    console.log('  📊 SUMMARY');
    console.log('═'.repeat(60));
    console.log(`  Images processed:  ${stats.processed}`);
    console.log(`  Thumbnails created: ${stats.created}`);
    console.log(`  Already existed:    ${stats.skipped}`);
    console.log(`  Errors:            ${stats.errors}`);
    console.log(`  Time taken:        ${duration}s`);
    console.log('═'.repeat(60));

    if (stats.created > 0) {
        console.log('\n  ✅ Success! Thumbnails generated.');
        console.log('  📝 Next steps:');
        console.log('     1. Update your HTML to use thumbnail images');
        console.log('     2. Add progressive loading JavaScript');
        console.log('     3. Test the gallery performance\n');
    } else if (stats.skipped > 0) {
        console.log('\n  ✅ All thumbnails already exist!\n');
    } else {
        console.log('\n  ⚠️  No thumbnails were created. Check your image paths.\n');
    }
}

// Run the script
main().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
});