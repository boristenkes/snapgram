import SubmitButton from '@/components/elements/submit-button'
import { type ButtonProps } from '@/components/ui/button'
import { acceptFollower } from '@/lib/actions/user.actions'
import toast from '@/lib/toast'

type AcceptFollowerButtonProps = ButtonProps & {
	senderId: string
	recipientId: string
}

export default async function AcceptFollowerButton({
	senderId,
	recipientId,
	...props
}: AcceptFollowerButtonProps) {
	const handleFormSubmit = async () => {
		'use server'

		const response = await acceptFollower(senderId, recipientId)

		if (!response.success) toast(response.message, { type: 'error' })
	}

	return (
		<form action={handleFormSubmit}>
			<SubmitButton {...props}>Accept</SubmitButton>
		</form>
	)
}
