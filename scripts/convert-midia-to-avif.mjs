/**
 * Converte imagens PNG/JPG/JPEG em `public/Midia Blupa/` para AVIF (recursivo).
 *
 * Uso:
 *   npm run convert:midia-avif
 *   node scripts/convert-midia-to-avif.mjs --delete-original
 *   node scripts/convert-midia-to-avif.mjs --quality=70 --dry-run
 *   node scripts/convert-midia-to-avif.mjs --force   (regrava .avif já existentes)
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MEDIA_DIR = path.join(ROOT, 'public', 'Midia Blupa')

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg'])

function parseArgs(argv) {
  let quality = 65
  let effort = 4
  let deleteOriginal = false
  let dryRun = false
  let force = false
  for (const a of argv) {
    if (a === '--delete-original') deleteOriginal = true
    else if (a === '--dry-run') dryRun = true
    else if (a === '--force') force = true
    else if (a.startsWith('--quality=')) {
      const n = Number(a.slice('--quality='.length))
      if (Number.isFinite(n) && n >= 1 && n <= 100) quality = n
      else {
        console.error('Use --quality=1..100')
        process.exit(1)
      }
    } else if (a.startsWith('--effort=')) {
      const n = Number(a.slice('--effort='.length))
      if (Number.isFinite(n) && n >= 0 && n <= 9) effort = Math.round(n)
      else {
        console.error('Use --effort=0..9')
        process.exit(1)
      }
    }
  }
  return { quality, effort, deleteOriginal, dryRun, force }
}

async function* walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) yield* walkFiles(full)
    else if (e.isFile()) yield full
  }
}

async function main() {
  const { quality, effort, deleteOriginal, dryRun, force } = parseArgs(process.argv.slice(2))

  try {
    await fs.access(MEDIA_DIR)
  } catch {
    console.error(`Pasta não encontrada: ${MEDIA_DIR}`)
    process.exit(1)
  }

  let converted = 0
  let skipped = 0

  for await (const filePath of walkFiles(MEDIA_DIR)) {
    const ext = path.extname(filePath).toLowerCase()
    if (!IMAGE_EXT.has(ext)) continue

    const outPath = `${filePath.slice(0, -ext.length)}.avif`
    const relIn = path.relative(ROOT, filePath)
    const relOut = path.relative(ROOT, outPath)

    if (!force && !dryRun) {
      const inStat = await fs.stat(filePath)
      try {
        const outStat = await fs.stat(outPath)
        if (outStat.mtimeMs >= inStat.mtimeMs) {
          skipped++
          continue
        }
      } catch {
        // .avif ainda não existe — converter
      }
    }

    if (dryRun) {
      console.log(`[dry-run] ${relIn} → ${relOut}`)
      converted++
      continue
    }

    await sharp(filePath).avif({ quality, effort }).toFile(outPath)
    console.log(`OK ${relOut}`)
    converted++

    if (deleteOriginal) {
      await fs.unlink(filePath)
      console.log(`   removido ${relIn}`)
    }
  }

  if (converted === 0 && skipped === 0) {
    console.log('Nenhum PNG/JPG/JPEG encontrado em', path.relative(ROOT, MEDIA_DIR))
  } else {
    const parts = [`${converted} conversão(ões)${dryRun ? ' (simulado)' : ''}`]
    if (skipped > 0) parts.push(`${skipped} já atualizado(s) (--force para regravar)`)
    console.log(`\nTotal: ${parts.join('; ')}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
