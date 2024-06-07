'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { forwardRef } from 'react'

const buttonVariants = cva(
	'flex justify-center items-center gap-4 font-semibold border-2 rounded-lg  hover:brightness-105 active:brightness-110 transition-colors transition-[filter] duration-200 active:duration-100 ease-in-out disabled:brightness-75 disabled:cursor-not-allowed',
	{
		variants: {
			variant: {
				primary: 'bg-primary-500 text-neutral-100 border-primary-500',
				secondary: 'bg-secondary-500 text-neutral-700 border-secondary-500',
				dark: 'bg-neutral-600 border-neutral-600 text-neutral-100',
				light: 'bg-neutral-200 border-neutral-200 text-neutral-700'
			},
			size: {
				xs: 'py-2 px-5 text-xs',
				sm: 'py-2.5 px-6 text-sm',
				rg: 'py-3 px-8 text-base'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'rg'
		}
	}
)

type DefaultProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonVariants>

export type ButtonProps = DefaultProps & {
	type?: 'button' | 'submit' | 'reset'
	href?: string
	stretch?: boolean
	square?: boolean
	ghost?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant,
			size,
			color,

			type = 'button',
			href,
			stretch,
			square,
			ghost,
			children,
			className,
			...rest
		},
		ref
	) => {
		const classNames = cn(buttonVariants({ variant, size, className }), {
			'p-0 w-fit h-fit bg-transparent border-transparent': ghost,
			'w-full': stretch,
			'aspect-square': square
		})

		if (href) {
			return href.includes('http') ? (
				<a
					href={href}
					className={classNames}
				>
					{children}
				</a>
			) : (
				<Link
					href={href}
					className={classNames}
				>
					{children}
				</Link>
			)
		}

		return (
			<button
				type={type}
				ref={ref}
				className={classNames}
				{...rest}
			>
				{children}
			</button>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
