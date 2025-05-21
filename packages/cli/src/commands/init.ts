import { promises as fs } from 'fs';
import path from 'path';

export async function run (
  stack = 'astro',
  output = 'frontend'
) {
  const cfgFile = 'staticpress.config.js';
  const cfgPath = path.resolve(process.cwd(), cfgFile);

  // 1) config stub (same as before)
  try {
    await fs.access(cfgPath);
    console.log(`⚠️  ${cfgFile} already exists – skipping.`);
  } catch {
    const stub = `module.exports = {
  siteUrl: 'https://example.com',
  stack: '${stack}',
  exclude: [],
  imageMaxWidth: 1920,
  cloudflareAccount: '',
};\n`;
    await fs.writeFile(cfgPath, stub, 'utf8');
    console.log(`✅  ${cfgFile} created.`);
  }

  // 2) copy the template
  const src = path.resolve(__dirname, '../../../../templates', stack);
  const dest = path.resolve(process.cwd(), output);

  try {
    await fs.access(dest);
    console.log(`⚠️  ${output}/ already exists – skipping copy.`);
  } catch {
    await fs.cp(src, dest, { recursive: true });
    console.log(`✅  ${stack} starter copied to ./${output}/`);
  }

  console.log(`👉  Stack selected: ${stack}`);
}
