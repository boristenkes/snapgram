'use client'

import { cn } from '@/lib/utils'
import { useFormStatus } from 'react-dom'
import Loader from '../loader'
import { Button, ButtonProps } from '../ui/button'

type SubmitButtonProps = ButtonProps & {
	pendingContent?: React.ReactNode
}

export default function SubmitButton({
	pendingContent = <Loader />,
	children,
	className,
	disabled,
	...rest
}: SubmitButtonProps) {
	const { pending } = useFormStatus()
	// const pending = true

	return (
		<Button
			type='submit'
			disabled={pending || disabled}
			className={cn('space-x-2', className)}
			{...rest}
		>
			{disabled || pending ? pendingContent || children : children}
		</Button>
	)
}
