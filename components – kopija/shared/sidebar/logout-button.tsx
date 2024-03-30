'use client'

import { signOut } from 'next-auth/react'
import { Button, ButtonProps } from '@/components/elements/button'

type LogoutButtonProps = ButtonProps & {
	children: React.ReactNode
}

export default function LogoutButton({ children, ...rest }: LogoutButtonProps) {
	return (
		<Button
			onClick={() => signOut({ callbackUrl: '/login' })}
			{...rest}
		>
			{children}
		</Button>
	)
}
