import SubmitButton from '@/components/elements/submit-button'
import { type ButtonProps } from '@/components/ui/button'
import { rejectFollower } from '@/lib/actions/user.actions'
import toast from '@/lib/toast'

type RejectFollowerButtonProps = ButtonProps & {
	senderId: string
	recipientId: string
}

export default function RejectFollowerButton({
	senderId,
	recipientId,
	...props
}: RejectFollowerButtonProps) {
	const handleFormSubmit = async () => {
		'use server'

		const response = await rejectFollower(senderId, recipientId)

		if (!response.success) toast(response.message, { type: 'error' })
	}

	return (
		<form action={handleFormSubmit}>
			<SubmitButton {...props}>Delete</SubmitButton>
		</form>
	)
}
