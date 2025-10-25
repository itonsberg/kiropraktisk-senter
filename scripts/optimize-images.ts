import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const HIGH_RES_DIR = '/Users/botega/kiropraktisksenter.no/images-high-res';
const TREATMENT_DIR = '/Users/botega/kiropraktisksenter.no/Hva vi behandler bilder';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images');

// Key images to optimize based on catalog
const KEY_IMAGES = {
  // Treatment sessions - Back
  'treatment-back-1.jpg': '4350.jpg',
  'treatment-back-2.jpg': '4361.jpg',
  'treatment-back-3.jpg': '4489.jpg',

  // Treatment sessions - Neck/Shoulder
  'treatment-neck-1.jpg': '4414.jpg',
  'treatment-neck-2.jpg': '4440.jpg',

  // Treatment sessions - Foot
  'treatment-foot-1.jpg': '4460.jpg',

  // Equipment
  'equipment-red-light.jpg': '4594.jpg',
  'equipment-spine-model.jpg': '4640.jpg',

  // Team portraits
  'team-senior-male-bw.jpg': '4763.jpg',
  'team-male-glasses-bw.jpg': '4698.jpg',
  'team-female-portrait.jpg': '4724.jpg',
  'team-young-male.jpg': '4460.jpg',

  // Injury care
  'care-injury-cast.jpg': '4446.jpg',

  // Hero/Featured
  'hero-treatment-bw.jpg': '4390.jpg',
};

// Treatment-specific images from "Hva vi behandler bilder"
const TREATMENT_IMAGES: Record<string, string> = {
  // Rygg
  'rygg-hero.jpg': 'Ryggbilder/back-pain-6949392_1920.jpg',
  'rygg-massage.jpg': 'Ryggbilder/massage-2441817_1280.jpg',

  // Nakke
  'nakke-hero.jpg': 'Nakkebilder/neckstretch-3795694_1280.jpg',
  'nakke-treatment.jpg': 'Nakkebilder/pexels-karolina-grabowska-4506164.jpg',

  // Kne
  'kne-hero.jpg': 'Kne/knee-2768834_1920.jpg',
  'kne-disease.jpg': 'Kne/disease-8198852_1920.jpg',

  // Skulder
  'skulder-hero.jpg': 'Skulderbilder/pexels-karolina-grabowska-4506166.jpg',

  // Hodepine
  'hodepine-hero.jpg': 'Hodepine Migrene/headache-6891133_1280.jpg',

  // Ankel/Fot
  'ankel-hero.jpg': 'Ankel/ankle-3135710_1920.jpg',

  // Håndledd
  'handledd-hero.jpg': 'Håndledd/kateryna-hliznitsova-QSupFdwa3F0-unsplash.jpg',

  // Albue
  'albue-hero.jpg': 'Albue/pexels-karolina-grabowska-8092949.jpg',

  // Kjeve
  'kjeve-hero.jpg': 'Kjeve/teeth-5536858_1280.jpg',

  // Myalgi/Muskelsmerter
  'myalgi-hero.jpg': 'Muskelsmerter/toa-heftiba-a9pFSC8dTlo-unsplash.jpg',
};

async function optimizeImages() {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    console.log('🖼️  Starting image optimization...\n');

    // Optimize high-res professional photos
    console.log('📷 Processing professional photos...');
    for (const [outputName, inputFile] of Object.entries(KEY_IMAGES)) {
      const inputPath = path.join(HIGH_RES_DIR, `Kiropraktisk senter_Fotograf Kristine Helleno-${inputFile}`);
      const outputPath = path.join(OUTPUT_DIR, outputName);

      try {
        await fs.access(inputPath);
        await sharp(inputPath)
          .resize(1920, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 85, progressive: true })
          .toFile(outputPath);

        const stats = await fs.stat(outputPath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`✅ ${outputName} (${sizeInMB}MB)`);
      } catch (err) {
        console.error(`❌ Failed to process ${inputFile}:`, err);
      }
    }

    // Optimize treatment-specific images
    console.log('\n🏥 Processing treatment images...');
    for (const [outputName, inputFile] of Object.entries(TREATMENT_IMAGES)) {
      const inputPath = path.join(TREATMENT_DIR, inputFile);
      const outputPath = path.join(OUTPUT_DIR, outputName);

      try {
        await fs.access(inputPath);
        await sharp(inputPath)
          .resize(1920, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 85, progressive: true })
          .toFile(outputPath);

        const stats = await fs.stat(outputPath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`✅ ${outputName} (${sizeInMB}MB)`);
      } catch (err) {
        console.error(`❌ Failed to process ${inputFile}:`, err);
      }
    }

    console.log('\n✨ Image optimization complete!');
  } catch (error) {
    console.error('Error during optimization:', error);
    process.exit(1);
  }
}

optimizeImages();
