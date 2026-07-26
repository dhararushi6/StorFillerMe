/**
 * B2-02: creates the two unsigned upload presets, each restricted to its folder.
 * Run once with live Cloudinary creds:  pnpm --filter @storefiller/api exec tsx scripts/cloudinary-presets.ts
 * Without creds it logs the intended presets (stub) instead of calling the API.
 */
import {
  cloudinary,
  cloudinaryStubbed,
  PRODUCT_UPLOAD_PRESET,
  DELIVERY_UPLOAD_PRESET,
  PRODUCT_UPLOAD_FOLDER,
  DELIVERY_UPLOAD_FOLDER,
} from '../src/lib/cloudinary';

const presets = [
  { name: PRODUCT_UPLOAD_PRESET, folder: PRODUCT_UPLOAD_FOLDER },
  { name: DELIVERY_UPLOAD_PRESET, folder: DELIVERY_UPLOAD_FOLDER },
];

async function ensurePreset(name: string, folder: string) {
  const settings = {
    name,
    unsigned: true,
    folder,
    allowed_formats: 'jpg,jpeg,png,webp',
    // f_webp thumbnail is applied at delivery time, not on upload.
  };
  try {
    await cloudinary.api.create_upload_preset(settings);
    console.log(`created preset ${name} -> ${folder}/`);
  } catch (err: unknown) {
    // Already exists → update it (idempotent).
    if ((err as { error?: { http_code?: number } })?.error?.http_code === 409) {
      await cloudinary.api.update_upload_preset(name, settings);
      console.log(`updated preset ${name} -> ${folder}/`);
    } else {
      throw err;
    }
  }
}

async function main() {
  if (cloudinaryStubbed) {
    console.log('[STUB] Cloudinary creds not set. Intended unsigned presets:');
    presets.forEach((p) => console.log(`  - ${p.name} restricted to folder ${p.folder}/`));
    return;
  }
  for (const p of presets) await ensurePreset(p.name, p.folder);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
