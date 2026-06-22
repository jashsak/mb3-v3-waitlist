import { motion, useReducedMotion, type Variants } from 'motion/react'
import { Avatar, AvatarFallback, AvatarImage } from '@material-bank/mb3-components/Avatar'
import { cn } from '@/lib/utils'
import { avatars } from '@/lib/scene'
import { GlassLayers } from '@/components/glass/liquid-glass'

/*
 * Overlapping avatar cluster + "+2.8k" glass chip. Each avatar pops in one
 * after another (staggered) as part of the hero load-in — a premium detail.
 * `delay` aligns the stagger with the orchestrated entrance in Hero.
 */
export function WaitlistAvatars({ className, delay = 0 }: { className?: string; delay?: number }) {
	const reduce = useReducedMotion()

	const container: Variants = {
		hidden: {},
		visible: { transition: { delayChildren: delay, staggerChildren: 0.08 } },
	}
	const item: Variants = reduce
		? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
		: {
				hidden: { opacity: 0, y: 14, scale: 0.6, filter: 'blur(4px)' },
				visible: {
					opacity: 1,
					y: 0,
					scale: 1,
					filter: 'blur(0px)',
					transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
				},
			}

	return (
		<motion.div
			className={cn('flex items-center', className)}
			variants={container}
			initial="hidden"
			animate="visible"
		>
			<div className="flex items-center">
				{avatars.map((src, i) => (
					<motion.div key={i} variants={item} className="-mr-2">
						<Avatar
							size={8}
							className="border-2 border-white/90 shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
						>
							<AvatarImage src={src} alt="" />
							<AvatarFallback className="bg-gray-700 text-[10px] text-white">MB</AvatarFallback>
						</Avatar>
					</motion.div>
				))}
				{/* Glass count chip — true liquid-glass surface. */}
				<motion.span
					variants={item}
					className={cn(
						'relative isolate inline-flex h-8 w-12 items-center justify-center overflow-hidden rounded-full',
						'text-sm font-medium tracking-[-0.28px] text-[var(--scene-text)]',
					)}
				>
					<GlassLayers />
					<span className="relative z-10">+2.8k</span>
				</motion.span>
			</div>
		</motion.div>
	)
}
