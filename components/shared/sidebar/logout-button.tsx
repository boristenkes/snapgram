'use client'

import { Button, ButtonProps } from '@/components/elements/button'
import { signOut } from 'next-auth/react'

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
