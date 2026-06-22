'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import { scenes } from '@/lib/scene'
import type { Scene } from '@/lib/utils'
import { Wordmark } from '@/components/Wordmark'
import { WaitlistAvatars } from '@/components/WaitlistAvatars'
import { TextSwap } from '@/components/TextSwap'
import {
	GlassInputGroup,
	GlassInputGroupInput,
	GlassSubmitButton,
} from '@/components/glass/glass-input-group'
import { ProgressiveBlur } from '@/components/glass/progressive-blur'

/* ─────────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — hero load-in (dusk)
 *
 *     0ms   background settles (scale 1.06 → 1, blur 10 → 0)
 *   320ms   "Material Bank V3" rises + de-blurs
 *   520ms   left line rises
 *   600ms   right line rises
 *   780ms   frosted band floats up
 *   840ms   glass pill rises
 *  1060ms   avatar cluster rises
 *  1200ms   "Join the waitlist" fades in
 *
 * On successful submit the pill cross-fades to the success state, then
 * after a delay the whole scene breaks into daylight (handled in App).
 * ───────────────────────────────────────────────────────────── */
const TIMING = {
	bg: 0,
	wordmark: 0.32,
	left: 0.52,
	right: 0.6,
	band: 0.78,
	input: 0.84,
	avatars: 1.06,
	label: 1.2,
} as const

// Design-system easings (mirror mb3 modal motion). customOut ≈ expo-out.
const EASE_OUT = [0.165, 0.84, 0.44, 1] as const
// Slow, cinematic daybreak — the scene eases from night to day over 5s.
const SCENE_DURATION = 5
const SCENE_EASE = [0.4, 0, 0.2, 1] as const

// Stage dimensions match the Figma frame so the overlay stays pixel-locked.
const STAGE_W = 1440
const STAGE_H = 913
const DESIGN_ASPECT = STAGE_W / STAGE_H

export type Phase = 'idle' | 'success'

interface HeroProps {
	scene: Scene
	/** Scene whose side copy is shown — lags `scene` so the text swaps mid-daybreak. */
	copyScene: Scene
	phase: Phase
	onSubmit: (email: string) => void
}

/**
 * Scale a 1440×913 stage to cover the viewport, and decide whether the poster
 * layout (wide / desktop) or the reflowed layout (narrow / portrait) applies.
 * The poster only works when the viewport is at least as wide as the design
 * aspect — otherwise the flanking copy would crop off-screen.
 */
function usePosterMode() {
	const [poster, setPoster] = React.useState(true)
	React.useLayoutEffect(() => {
		const apply = () => {
			const { innerWidth: w, innerHeight: h } = window
			document.documentElement.style.setProperty(
				'--stage-scale',
				String(Math.max(w / STAGE_W, h / STAGE_H)),
			)
			setPoster(w / h >= DESIGN_ASPECT - 0.06 && w >= 768)
		}
		apply()
		window.addEventListener('resize', apply)
		return () => window.removeEventListener('resize', apply)
	}, [])
	return poster
}

export function Hero({ scene, copyScene, phase, onSubmit }: HeroProps) {
	const reduce = useReducedMotion()
	const poster = usePosterMode()
	const [email, setEmail] = React.useState('')
	const copy = scenes[copyScene]

	// Spring-first entrances (interface-craft): a soft, overshoot-free settle.
	// Blur/opacity ride a short tween so they finish crisply; transform springs.
	const rise = (delay: number) =>
		reduce
			? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: delay * 0.4 } }
			: {
					initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
					animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
					transition: {
						delay,
						y: { type: 'spring', visualDuration: 0.7, bounce: 0 },
						opacity: { duration: 0.6, ease: EASE_OUT },
						filter: { duration: 0.7, ease: EASE_OUT },
					},
				}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (phase === 'success') return
		const trimmed = email.trim()
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return
		onSubmit(trimmed)
	}

	const waitlistForm = (
		<>
			<GlassInputGroup className="h-14">
				<div className="relative min-w-0 flex-1">
					<AnimatePresence mode="wait" initial={false}>
						{phase === 'success' ? (
							<motion.p
								key="success-text"
								initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
								animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
								transition={{ duration: 0.4, ease: EASE_OUT }}
								className="scene-shadow truncate text-sm tracking-[-0.28px] text-[var(--scene-text)]"
							>
								Rolling out soon. You&apos;re on the waitlist!
							</motion.p>
						) : (
							<motion.div
								key="email-input"
								className="w-full"
								initial={false}
								exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
								transition={{ duration: 0.2, ease: EASE_OUT }}
							>
								<GlassInputGroupInput
									type="email"
									inputMode="email"
									autoComplete="email"
									placeholder="Enter your organisation email..."
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									aria-label="Organisation email"
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<AnimatePresence mode="wait" initial={false}>
					{phase === 'success' ? (
						<motion.div
							key="success"
							initial={{ opacity: 0, scale: 0.6 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.32, ease: EASE_OUT }}
						>
							<GlassSubmitButton tone="affirmative" type="button" aria-label="Joined the waitlist">
								<Check className="size-4" strokeWidth={2.5} />
							</GlassSubmitButton>
						</motion.div>
					) : (
						<motion.div
							key="idle"
							initial={false}
							exit={{ opacity: 0, scale: 0.6 }}
							transition={{ duration: 0.2, ease: EASE_OUT }}
						>
							<GlassSubmitButton type="submit" aria-label="Join the waitlist">
								<ArrowRight className="size-4" strokeWidth={2.25} />
							</GlassSubmitButton>
						</motion.div>
					)}
				</AnimatePresence>
			</GlassInputGroup>
			<span className="sr-only" aria-live="polite">
				{phase === 'success' ? "Rolling out soon. You're on the waitlist!" : ''}
			</span>
		</>
	)

	const background = <SceneBackground scene={scene} reduce={!!reduce} />

	return (
		<main
			data-scene={scene}
			className="relative h-dvh w-full overflow-hidden bg-[#0b0d12]"
		>
			{poster ? (
				/* ── Desktop: 1440×913 poster stage scaled to cover the viewport ── */
				<div
					className="absolute left-1/2 top-1/2"
					style={{
						width: STAGE_W,
						height: STAGE_H,
						transform: 'translate(-50%, -50%) scale(var(--stage-scale, 1))',
						transformOrigin: 'center',
					}}
				>
					{background}

					<motion.div
						aria-hidden
						className="absolute left-0 w-[1440px]"
						style={{ top: 598, height: 315 }}
						initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: TIMING.band, ease: EASE_OUT }}
					>
						<ProgressiveBlur />
						<div className="absolute inset-0" style={{ background: 'var(--glass-band)' }} />
					</motion.div>

					<motion.div
						className="absolute left-1/2 -translate-x-1/2"
						style={{ top: 125 }}
						{...rise(TIMING.wordmark)}
					>
						<Wordmark />
					</motion.div>

					<motion.p
						className="scene-shadow absolute -translate-x-full text-right text-[18px] leading-6 tracking-[-0.36px] text-[var(--scene-copy)]"
						style={{ left: 353, top: 452 }}
						{...rise(TIMING.left)}
					>
						<TextSwap value={copy.left} className="whitespace-nowrap" />
					</motion.p>

					<motion.p
						className="scene-shadow absolute -translate-x-1/2 text-center text-[18px] leading-6 tracking-[-0.36px] text-[var(--scene-copy)]"
						style={{ left: 1191, top: 452 }}
						{...rise(TIMING.right)}
					>
						<TextSwap value={copy.right} className="whitespace-nowrap" />
					</motion.p>

					<motion.form
						onSubmit={handleSubmit}
						className="absolute"
						style={{ left: 486, top: 695, width: 469 }}
						{...rise(TIMING.input)}
					>
						{waitlistForm}
					</motion.form>

					<motion.div
						className="absolute left-1/2 -translate-x-1/2"
						style={{ top: 764 }}
						{...rise(TIMING.avatars)}
					>
						<WaitlistAvatars />
					</motion.div>

					<motion.p
						className="scene-shadow absolute left-1/2 -translate-x-1/2 text-center text-[16px] leading-6 tracking-[-0.32px] text-[var(--scene-label)]"
						style={{ top: 811 }}
						{...rise(TIMING.label)}
					>
						Join the waitlist
					</motion.p>
				</div>
			) : (
				/* ── Mobile / portrait: reflowed full-bleed layout ── */
				<>
					{background}
					{/* Frosted band anchored to the bottom 48% of the viewport. */}
					<motion.div
						aria-hidden
						className="absolute inset-x-0 bottom-0 h-[48%]"
						initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: TIMING.band, ease: EASE_OUT }}
					>
						<ProgressiveBlur />
						<div className="absolute inset-0" style={{ background: 'var(--glass-band)' }} />
					</motion.div>

					<div className="relative flex h-full flex-col items-center px-5">
						<motion.div className="pt-[7vh]" {...rise(TIMING.wordmark)}>
							{/* Bigger, viewport-responsive lockup on mobile. */}
							<Wordmark style={{ fontSize: 'clamp(2.25rem, 10.5vw, 3rem)' }} />
						</motion.div>

						<div className="mt-auto flex w-full max-w-[420px] flex-col items-center gap-5 pb-[8vh]">
							<div className="space-y-1 text-center">
								<motion.p
									className="scene-shadow text-[17px] leading-6 tracking-[-0.02em] text-[var(--scene-copy)]"
									{...rise(TIMING.left)}
								>
									<TextSwap value={copy.left} />
								</motion.p>
								<motion.p
									className="scene-shadow text-[17px] leading-6 tracking-[-0.02em] text-[var(--scene-copy)]"
									{...rise(TIMING.right)}
								>
									<TextSwap value={copy.right} />
								</motion.p>
							</div>

							<motion.form onSubmit={handleSubmit} className="w-full" {...rise(TIMING.input)}>
								{waitlistForm}
							</motion.form>

							<motion.div {...rise(TIMING.avatars)}>
								<WaitlistAvatars />
							</motion.div>

							<motion.p
								className="scene-shadow text-center text-[16px] leading-6 tracking-[-0.32px] text-[var(--scene-label)]"
								{...rise(TIMING.label)}
							>
								Join the waitlist
							</motion.p>
						</div>
					</div>
				</>
			)}
		</main>
	)
}

/** Reusable night→day photographic background with the load-in settle. */
function SceneBackground({ scene, reduce }: { scene: Scene; reduce: boolean }) {
	return (
		<motion.div
			className="absolute inset-0"
			initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
			animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
			transition={{ duration: 1.5, ease: EASE_OUT, delay: TIMING.bg }}
		>
			<div className="scene-fallback-night absolute inset-0" />
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: `url(${scenes.night.bg})` }}
			/>
			<div
				className="scene-fallback-day absolute inset-0"
				style={{
					opacity: scene === 'day' ? 1 : 0,
					transition: `opacity ${SCENE_DURATION}s cubic-bezier(0.4,0,0.2,1)`,
				}}
			/>
			<motion.div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: `url(${scenes.day.bg})` }}
				initial={false}
				animate={{ opacity: scene === 'day' ? 1 : 0 }}
				transition={{ duration: SCENE_DURATION, ease: SCENE_EASE }}
			/>
			<motion.div
				aria-hidden
				className="absolute inset-0"
				style={{
					background:
						'radial-gradient(120% 70% at 50% -10%, rgba(255,221,170,0.28), transparent 55%)',
				}}
				initial={false}
				animate={{ opacity: scene === 'day' ? [0, 0.6, 0] : 0 }}
				transition={{ duration: SCENE_DURATION, ease: 'easeInOut' }}
			/>
		</motion.div>
	)
}
