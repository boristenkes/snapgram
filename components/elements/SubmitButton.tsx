import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './Button'
import { cn } from '@/lib/utils'

type SubmitButtonProps = ButtonProps & {
	pendingContent?: React.ReactNode
}

export default function SubmitButton({
	pendingContent,
	children,
	className,
	...rest
}: SubmitButtonProps) {
	const { pending } = useFormStatus()
	// const pending = true

	return (
		<Button
			type='submit'
			disabled={pending}
			className={cn(
				{
					'brightness-75 cursor-wait hover:brightness-75 active:brightness-75':
						pending
				},
				className
			)}
			{...rest}
		>
			{pending ? pendingContent || children : children}
		</Button>
	)
}
