'use client'

import Link from 'next/link'
import { useFormStatus } from 'react-dom'

/*

colors:
	1. primary (#877EFF)
		- bg: #877EFF
		- text: #EFEFEF
	2. secondary (#FFB620)
		- bg: #FFB620
		- text: #101012
	3. light (#EFEFEF)
		- bg: #EFEFEF
		- text: #09090A
	4. danger (#FF5A5A)
		- bg: #FF5A5A
		- text: #EFEFEF
	
variants: 
	1. contained
	2. text
	3. outlined

sizes:
	1.
		fs: 12px
		py: 6px
		px: 18px
		br: 8px
	2.
		fs: 14px
		py: 10px
		px: 20px
		br: 8px
	3.
		fs: 16px
		py: 12px
		px: 20px
		br: 8px
*/

const sizes = {
	sm: 'text-xs py-1.5 px-5 rounded-lg',
	rg: 'text-sm py-2.5 px-5 rounded-lg',
	lg: 'text-base py-3 px-5 rounded-lg'
}

const colors = {
	primary: {
		contained:
			'bg-primary-500 hover:bg-primary-400 text-neutral-100 border-primary-500',
		text: 'text-primary-500 hover:text-primary-400 border-transparent',
		outlined:
			'text-primary-500 hover:text-primary-400 border-primary-500 hover:border-primary-400'
	},
	secondary: {
		contained:
			'bg-secondary-500 hover:bg-secondary-200 text-neutral-100 border-secondary-500',
		text: 'text-secondary-500 hover:text-secondary-200 border-transparent',
		outlined: 'text-secondary-500 hover:text-secondary-200'
	},
	light: {
		contained:
			'bg-neutral-200 hover:bg-neutral-100 text-neutral-800 border-neutral-200',
		text: 'text-neutral-200 hover:text-neutral-100 border-transparent',
		outlined:
			'text-neutral-200 hover:text-neutral-100 border-neutral-200 hover:border-neutral-100'
	}
}

export type Variant = 'contained' | 'text' | 'outlined'
export type Color = 'primary' | 'secondary' | 'light'
export type Size = 'sm' | 'rg' | 'lg'

type ButtonPropsCommon = {
	type?: 'button' | 'reset' | 'submit'
	variant?: Variant
	color?: Color
	size?: Size
	stretch?: boolean
	children: React.ReactNode
	className?: string
	startIcon?: React.ReactNode
	endIcon?: React.ReactNode
	target?: '_self' | '_blank'
	style?: React.CSSProperties
}

type WithHref = ButtonPropsCommon & {
	href: string
	onClick?: never
}

type WithOnClick = ButtonPropsCommon & {
	onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	href?: never
}

type ButtonProps = WithHref | WithOnClick

export default function Button({
	type = 'button',
	variant = 'contained',
	color = 'primary',
	size = 'rg',
	stretch = false,
	children,
	className = '',
	onClick,
	href,
	startIcon,
	endIcon,
	target = '_self',
	style,
	...rest
}: ButtonProps) {
	const { pending } = useFormStatus()
	const props = {
		type,
		style,
		className: getClassName(variant, color, size, stretch, className)
	}

	return href ? (
		href.includes('http') ? (
			<a
				href={href}
				target={target}
				{...props}
			>
				{startIcon}
				{children}
				{endIcon}
			</a>
		) : (
			<Link
				href={href}
				{...props}
			>
				{startIcon}
				{children}
				{endIcon}
			</Link>
		)
	) : (
		<button
			onClick={onClick}
			{...props}
			{...rest}
		>
			{startIcon}
			{children}
			{endIcon}
		</button>
	)
}

function getClassName(
	variant: Variant,
	color: Color,
	size: Size,
	stretch: boolean,
	className: string
) {
	const classes = [
		'flex_center gap-4 font-semibold py-[1em] px-[2em] border-2 border-solid rounded-lg transition-colors duration-200 ease-in-out',
		colors[color][variant],
		sizes[size]
	]

	if (variant === 'text') {
		classes.push('!w-fit !h-fit !p-0 !m-0 !inline')
	} else if (stretch) {
		classes.push('w-full')
	}

	classes.push(className)

	return classes.join(' ')
}
