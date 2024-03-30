'use client'

import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './button'
import Loader from '../loader'

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
			className={className}
			{...rest}
		>
			{pending ? pendingContent || children : children}
		</Button>
	)
}
