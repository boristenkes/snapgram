'use client'

import { signOut } from 'next-auth/react'
import { Button } from './elements'
import { Variant, Color, Size } from './elements/Button'

type LogoutButtonProps = {
	variant?: Variant
	color?: Color
	size?: Size
	children: React.ReactNode
}

export async function LogoutButton({
	variant,
	color,
	size,
	children
}: LogoutButtonProps) {
	return (
		<Button
			variant={variant}
			color={color}
			size={size}
			onClick={() => signOut({ callbackUrl: '/login' })}
		>
			{children}
		</Button>
	)
}
