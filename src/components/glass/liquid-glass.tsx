import { cn } from '@/lib/utils'

/*
 * Liquid glass, web edition — inspired by Aave's "Building glass for the web".
 *
 * Real glass does three things a flat translucent fill can't:
 *   1. Frost   — blurs + saturates what's behind it (backdrop-filter).
 *   2. Refract — bends the backdrop near the edges (SVG feDisplacementMap).
 *   3. Catch light — a bright specular rim around the bevel.
 *
 * <GlassFilters/> renders the SVG displacement filter once per app.
 * <GlassLayers/> stacks the frost+refraction surface and the specular rim
 * behind a host element (which positions them via `inherit` radius).
 */

export function GlassFilters() {
	return (
		<svg
			aria-hidden
			width="0"
			height="0"
			style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
		>
			<defs>
				{/* Watery refraction: low-frequency noise drives a gentle displacement
				 * of the backdrop, so the blurred scene bends like it would through glass. */}
				<filter id="liquidGlass" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
					<feTurbulence type="fractalNoise" baseFrequency="0.008 0.013" numOctaves="2" seed="6" result="noise" />
					<feGaussianBlur in="noise" stdDeviation="1.4" result="softNoise" />
					<feDisplacementMap
						in="SourceGraphic"
						in2="softNoise"
						scale="14"
						xChannelSelector="R"
						yChannelSelector="G"
					/>
				</filter>
			</defs>
		</svg>
	)
}

export function GlassLayers({ className }: { className?: string }) {
	return (
		<>
			{/* Frost + refraction (the part that reads the scene behind). */}
			<span aria-hidden className={cn('glass-surface pointer-events-none absolute inset-0', className)} />
			{/* Specular bevel rim + diagonal sheen, painted above the frost. */}
			<span aria-hidden className={cn('glass-rim pointer-events-none absolute inset-0', className)} />
		</>
	)
}
