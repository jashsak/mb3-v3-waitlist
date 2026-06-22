import { Avatar, AvatarFallback, AvatarImage } from '@material-bank/mb3-components/Avatar'
import { cn } from '@/lib/utils'
import { avatars } from '@/lib/scene'
import { GlassLayers } from '@/components/glass/liquid-glass'

/*
 * Overlapping avatar cluster + "+2.8k" count chip, used under the input as
 * social proof. Built on the base <Avatar>; each avatar gets a scene-tinted
 * ring so the cluster reads cleanly over both the night and day backgrounds.
 */
export function WaitlistAvatars({ className }: { className?: string }) {
	return (
		<div className={cn('flex items-center', className)}>
			<div className="flex items-center">
				{avatars.map((src, i) => (
					<Avatar
						key={i}
						size={8}
						className="-mr-2 border-2 border-white/90 shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
					>
						<AvatarImage src={src} alt="" />
						<AvatarFallback className="bg-gray-700 text-[10px] text-white">
							MB
						</AvatarFallback>
					</Avatar>
				))}
				{/* Glass count chip — true liquid-glass surface. */}
				<span
					className={cn(
						'relative isolate inline-flex h-8 w-12 items-center justify-center overflow-hidden rounded-full',
						'text-sm font-medium tracking-[-0.28px] text-[var(--scene-text)]',
					)}
				>
					<GlassLayers />
					<span className="relative z-10">+2.8k</span>
				</span>
			</div>
		</div>
	)
}
