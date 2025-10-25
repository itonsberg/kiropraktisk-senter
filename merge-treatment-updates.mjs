#!/usr/bin/env node
/**
 * Merge Treatment Updates Script
 *
 * Merges all updated treatment pages from /tmp/treatment-updates/
 * into the main knowledge-base.json file.
 *
 * Usage: node merge-treatment-updates.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const updateDir = '/tmp/treatment-updates';
const kbPath = path.join(__dirname, 'lib', 'knowledge-base.json');

// Treatment IDs to update
const treatmentIds = [
  'rygg',
  'nakke',
  'skulder',
  'myalgi',
  'kne',
  'ankel_fot',
  'handledd',
  'albue',
  'kjeve',
  'hodepine'
];

console.log('🔄 Starting treatment updates merge...\n');

// Read current knowledge base
console.log('📖 Reading current knowledge-base.json...');
const kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
console.log(`✅ Loaded ${kb.length} entries\n`);

let updateCount = 0;
let errorCount = 0;

// Merge each update
treatmentIds.forEach(id => {
  const updatePath = path.join(updateDir, `${id}.json`);

  if (!fs.existsSync(updatePath)) {
    console.log(`⚠️  Missing update file for: ${id}`);
    errorCount++;
    return;
  }

  try {
    const update = JSON.parse(fs.readFileSync(updatePath, 'utf8'));

    // Find entry in knowledge base
    const index = kb.findIndex(entry => entry.id === id);

    if (index !== -1) {
      kb[index] = update;
      console.log(`✅ Updated ${id} (${update.title})`);

      // Show metadata summary
      const meta = update.metadata;
      console.log(`   Grade: ${meta.evidenceGrade || 'N/A'}`);
      console.log(`   Red Flags: ${meta.redFlags?.length || 0}`);
      console.log(`   Citations: ${meta.researchCitations?.length || 0}`);
      console.log(`   Timeline: ${meta.timeline || 'N/A'}`);
      console.log('');

      updateCount++;
    } else {
      console.log(`❌ Could not find entry for ${id} in knowledge base`);
      errorCount++;
    }
  } catch (error) {
    console.log(`❌ Error updating ${id}: ${error.message}`);
    errorCount++;
  }
});

// Write back to file
console.log('\n💾 Writing updated knowledge-base.json...');
fs.writeFileSync(kbPath, JSON.stringify(kb, null, 2), 'utf8');

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 MERGE SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Successfully updated: ${updateCount}/${treatmentIds.length} pages`);
console.log(`❌ Errors: ${errorCount}`);
console.log('');

if (updateCount === treatmentIds.length) {
  console.log('🎉 ALL TREATMENT PAGES SUCCESSFULLY MERGED!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Validate JSON: python3 -m json.tool lib/knowledge-base.json > /dev/null');
  console.log('2. Test locally: npm run dev');
  console.log('3. Review changes: git diff lib/knowledge-base.json');
  console.log('4. Commit: git add lib/knowledge-base.json && git commit -m "Update all treatment pages with evidence-based content"');
} else {
  console.log('⚠️  Some pages failed to merge. Please review errors above.');
}

console.log('');
