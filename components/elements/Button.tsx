'use client'

import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import Link from 'next/link'
import { forwardRef } from 'react'

const buttonVariants = cva(
	'flex justify-center items-center gap-4 font-semibold border-2 rounded-lg  hover:brightness-105 active:brightness-110 transition-colors transition-[filter] duration-200 active:duration-100 ease-in-out',
	{
		variants: {
			variant: {
				primary: 'bg-primary-500 text-neutral-100 border-primary-500',
				secondary: 'bg-secondary-500 text-neutral-700 border-secondary-500',
				dark: 'bg-neutral-700 border-neutral-700 text-neutral-100',
				light: 'bg-neutral-200 border-neutral-200 text-neutral-700'
			},
			size: {
				xs: 'py-2 px-5 text-xs',
				sm: 'py-3 px-5 text-sm',
				rg: 'py-3 px-5 text-base'
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
		if (href) {
			return href.includes('http') ? (
				<a
					href={href}
					className={cn(buttonVariants({ variant, size, className }))}
				>
					<p className='border-2'></p>
					{children}
				</a>
			) : (
				<Link
					href={href}
					className={cn(buttonVariants({ variant, size, className }))}
				>
					{children}
				</Link>
			)
		}

		return (
			<button
				type={type}
				ref={ref}
				className={cn(buttonVariants({ variant, size, className }), {
					'p-0 w-fit h-fit bg-transparent border-transparent': ghost,
					'w-full': stretch,
					'aspect-square': square
				})}
				{...rest}
			>
				{children}
			</button>
		)
	}
)

export { Button, buttonVariants }
