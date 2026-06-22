import { cn } from '@/lib/utils'

/*
 * ProgressiveBlur — a graduated backdrop blur (à la iOS) rather than a single
 * hard cut. Stacks layers of increasing blur, each revealed through a sliding
 * gradient mask, so the blur ramps smoothly from 0 at the top edge to full at
 * the bottom. Fills its positioned parent.
 */
const LAYERS = [
	{ blur: 0.5, from: 0, to: 37.5 },
	{ blur: 1, from: 12.5, to: 50 },
	{ blur: 2, from: 25, to: 62.5 },
	{ blur: 4, from: 37.5, to: 75 },
	{ blur: 8, from: 50, to: 87.5 },
	{ blur: 16, from: 62.5, to: 100 },
]

function mask(from: number, to: number): string {
	const mid1 = from + (to - from) * 0.34
	const mid2 = from + (to - from) * 0.66
	return `linear-gradient(to bottom, rgba(0,0,0,0) ${from}%, rgba(0,0,0,1) ${mid1}%, rgba(0,0,0,1) ${mid2}%, rgba(0,0,0,0) ${to}%)`
}

export function ProgressiveBlur({ className }: { className?: string }) {
	return (
		<div aria-hidden className={cn('pointer-events-none absolute inset-0', className)}>
			{LAYERS.map((l, i) => (
				<div
					key={i}
					className="absolute inset-0"
					style={{
						backdropFilter: `blur(${l.blur}px)`,
						WebkitBackdropFilter: `blur(${l.blur}px)`,
						maskImage: mask(l.from, l.to),
						WebkitMaskImage: mask(l.from, l.to),
					}}
				/>
			))}
		</div>
	)
}
