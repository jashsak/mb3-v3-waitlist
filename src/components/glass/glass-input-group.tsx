'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Button, type ButtonProps } from '@material-bank/mb3-components/Button'
import { cn } from '@/lib/utils'
import { GlassLayers } from '@/components/glass/liquid-glass'

/*
 * GlassInputGroup — a modified version of mb3-components' <InputGroup>.
 *
 * The base InputGroup is a bordered, solid, square-ish control. The Figma
 * "InputGroup" on the V3 hero is a frosted-glass pill that floats over a
 * photographic scene, so this variant keeps the base structure (group +
 * control + inline-end addon) but replaces the surface with the glass
 * treatment defined in index.css (--glass-* tokens).
 */
export function GlassInputGroup({
	className,
	children,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="input-group"
			role="group"
			className={cn(
				'group/input-group relative isolate flex w-full items-center overflow-hidden',
				'gap-1 rounded-full py-2 pl-5 pr-3',
				'transition-shadow duration-300',
				'has-[input:focus-visible]:shadow-[0_0_0_3px_rgba(255,255,255,0.14)]',
				className,
			)}
			{...props}
		>
			<GlassLayers />
			<div className="relative z-10 flex w-full items-center gap-1">{children}</div>
		</div>
	)
}

export function GlassInputGroupInput({
	className,
	...props
}: React.ComponentProps<'input'>) {
	return (
		<input
			data-slot="input-group-control"
			className={cn(
				'w-full min-w-0 flex-1 border-0 bg-transparent text-sm tracking-[-0.28px]',
				'text-[var(--scene-text)] caret-[var(--color-brand)] outline-none',
				'placeholder:text-[color:rgba(255,255,255,0.55)]',
				'disabled:cursor-not-allowed disabled:opacity-60',
				className,
			)}
			{...props}
		/>
	)
}

/*
 * glassSubmitButtonVariants — modified from buttonVariants. Adds an
 * `affirmative` tone (green success) the base Button doesn't ship, while
 * reusing the same gradient-overlay + press-scale grammar as the base.
 */
const glassSubmitButtonVariants = cva('', {
	variants: {
		tone: {
			brand: '',
			affirmative: [
				'border-[var(--color-affirmative)] bg-[var(--color-affirmative)]',
				'text-white before:bg-[linear-gradient(180deg,var(--color-alpha-30)_0%,var(--color-alpha-5)_100%)]',
				'hover:bg-[var(--color-affirmative)]',
			].join(' '),
		},
	},
	defaultVariants: { tone: 'brand' },
})

export interface GlassSubmitButtonProps
	extends Omit<ButtonProps, 'variant' | 'size'>,
		VariantProps<typeof glassSubmitButtonVariants> {}

export function GlassSubmitButton({
	className,
	tone,
	...props
}: GlassSubmitButtonProps) {
	return (
		<Button
			variant="brand"
			size="icon"
			className={cn(
				// Capsule (pill) — wider than tall, matching the Figma Brand/icon button.
				'h-9 shrink-0 rounded-full px-4',
				glassSubmitButtonVariants({ tone }),
				className,
			)}
			{...props}
		/>
	)
}
