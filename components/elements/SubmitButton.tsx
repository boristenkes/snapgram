import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './Button'

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
			className={className}
			{...rest}
		>
			{pending ? pendingContent || children : children}
		</Button>
	)
}
