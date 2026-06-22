import type { Scene } from '@/lib/utils'

export interface SceneCopy {
	/** Background image for the scene (full desk-by-the-window composition). */
	bg: string
	/** Left and right flanking lines beside the monitor. */
	left: string
	right: string
}

/*
 * Single source of truth for the two scene states. The hero cross-fades
 * between these as the page transitions from dusk to daylight.
 * Background images live in /public/scene and are swapped in from Figma.
 */
export const scenes: Record<Scene, SceneCopy> = {
	night: {
		bg: `${import.meta.env.BASE_URL}scene/night.webp`,
		left: 'Our biggest launch in history',
		right: 'Supercharged for the way you work.',
	},
	day: {
		bg: `${import.meta.env.BASE_URL}scene/day.webp`,
		left: 'Still 700 top brands overnight.',
		right: 'Always free.',
	},
}

export const avatars: string[] = [
	'https://i.pravatar.cc/64?img=12',
	'https://i.pravatar.cc/64?img=32',
	'https://i.pravatar.cc/64?img=45',
	'https://i.pravatar.cc/64?img=5',
]
