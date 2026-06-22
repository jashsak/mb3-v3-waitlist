import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/*
 * The "Material Bank V3" lockup. Everything is sized in `em` off a single
 * container font-size (the wordmark height), so callers scale the whole lockup
 * by overriding `fontSize` — desktop is fixed at the Figma 38.87px, mobile
 * uses a responsive clamp. Wordmark is Inter ExtraBold, tightly tracked; the
 * V3 chip reuses the brand yellow with dark secondary-foreground text.
 */
export function Wordmark({ className, style }: { className?: string; style?: CSSProperties }) {
	return (
		<div
			className={cn('flex items-center', className)}
			style={{ fontSize: '38.87px', gap: '0.26em', ...style }}
		>
			<span
				className="wordmark-text font-extrabold leading-none tracking-[-0.05em] text-[var(--scene-heading)]"
				style={{ fontSize: '1em' }}
			>
				Material Bank
			</span>
			<span
				className={cn(
					'inline-flex items-center justify-center bg-[var(--color-brand)]',
					'font-extrabold leading-none tracking-[-0.03em] text-[var(--color-secondary-foreground)]',
					'shadow-[0_1px_1px_rgba(17,24,39,0.1),inset_0_1px_0_var(--color-alpha-40)]',
				)}
				style={{
					// Sized relative to the badge's own 0.515em font; 1.75em ≈ 35px,
					// 0.5em ≈ 10px when the container is at the 38.87px desktop size.
					fontSize: '0.515em',
					height: '1.75em',
					paddingInline: '0.5em',
					borderRadius: '0.5em',
				}}
			>
				V3
			</span>
		</div>
	)
}
