/*
 * Optimize the hero background photos for the web.
 *
 * The Figma exports are only ~1024px wide — smaller than the 1440 design frame —
 * so they soften when the poster stage upscales them to cover the viewport.
 * We Lanczos-upscale to 2x and apply a light unsharp mask, then emit WebP. The
 * browser then *downscales* the 2x asset (crisp) instead of upscaling (soft).
 *
 * Drop higher-resolution source exports into scripts/src/ (same filenames) and
 * re-run `node scripts/optimize-bg.mjs` for a true sharpness win.
 */
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const root = path.dirname(fileURLToPath(import.meta.url))
const out = path.resolve(root, '../public/scene')

const SOURCES = [
	{ name: 'night', candidates: ['src/night@4x.jpg', 'src/night@4x.png', 'src/night.jpg', 'src/night.png'] },
	{ name: 'day', candidates: ['src/day@4x.jpg', 'src/day@4x.png', 'src/day.jpg', 'src/day.png'] },
]

// Fallback to the original low-res exports if no hi-res source is present.
const FALLBACK = {
	night:
		'/Users/joashsakula/.cursor/projects/Users-joashsakula-mb3-v3-waitlist/assets/image_416-ce648e26-b04c-4750-acc4-5b73a8fdb99f.png',
	day:
		'/Users/joashsakula/.cursor/projects/Users-joashsakula-mb3-v3-waitlist/assets/image_416-2-e629ca67-80fc-4032-b750-057d7fc5ad79.png',
}

// Target width: retina-crisp on large displays without a huge payload.
const TARGET_W = 2880

for (const { name, candidates } of SOURCES) {
	let input = candidates.map((c) => path.resolve(root, c)).find(existsSync)
	if (!input) input = FALLBACK[name]

	const meta = await sharp(input).metadata()
	const upscaling = meta.width < TARGET_W

	const img = sharp(input).resize({
		width: TARGET_W,
		fit: 'inside',
		withoutEnlargement: false,
		kernel: sharp.kernel.lanczos3,
	})

	// Light unsharp mask to counter interpolation softness when upscaling.
	if (upscaling) img.sharpen({ sigma: 0.8, m1: 0.5, m2: 1.2 })

	const dest = path.join(out, `${name}.webp`)
	const info = await img.webp({ quality: 90, effort: 6, smartSubsample: true }).toFile(dest)
	console.log(
		`${name}: ${meta.width}×${meta.height} → ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)}KB${upscaling ? '  (upscaled + sharpened)' : ''}`,
	)
}
