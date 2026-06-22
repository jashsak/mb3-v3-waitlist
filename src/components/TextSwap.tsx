'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/*
 * TextSwap — transitions.dev "Text states swap" (04-text-states-swap).
 *
 * Three-phase, in-place swap: the old text slides up + blurs + fades out, the
 * content changes, then the new text enters from below. Content is managed
 * imperatively (textContent) so React never fights the mid-swap DOM state.
 *
 * Keep DUR in sync with --text-swap-dur in index.css.
 */
const DUR = 240

export function TextSwap({ value, className }: { value: string; className?: string }) {
	const ref = React.useRef<HTMLSpanElement>(null)
	const shown = React.useRef<string | null>(null)

	React.useLayoutEffect(() => {
		const el = ref.current
		if (!el) return

		// First paint — set text with no animation.
		if (shown.current === null) {
			el.textContent = value
			shown.current = value
			return
		}
		if (value === shown.current) return

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduce) {
			el.textContent = value
			shown.current = value
			return
		}

		// 1. Exit up + blur + fade.
		el.classList.add('is-exit')
		const t = window.setTimeout(() => {
			// 2. Swap content, jump below with no transition.
			el.textContent = value
			shown.current = value
			el.classList.remove('is-exit')
			el.classList.add('is-enter-start')
			// 3. Reflow, then release so it animates back to rest.
			void el.offsetHeight
			el.classList.remove('is-enter-start')
		}, DUR)

		return () => window.clearTimeout(t)
	}, [value])

	return <span ref={ref} className={cn('t-text-swap', className)} />
}
