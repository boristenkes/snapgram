'use client'

import { signOut } from 'next-auth/react'
import { Button, ButtonProps } from './elements/Button'

type LogoutButtonProps = ButtonProps & {
	children: React.ReactNode
}

export function LogoutButton({ children, ...rest }: LogoutButtonProps) {
	return (
		<Button
			onClick={() => signOut({ callbackUrl: '/login' })}
			{...rest}
		>
			{children}
		</Button>
	)
}
