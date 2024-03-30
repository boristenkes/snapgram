import { type ButtonProps } from './elements'
import {
	follow,
	unfollow,
	sendFollowRequest,
	unsendFollowRequest
} from '@/lib/actions/user.actions'
import { useMemo } from 'react'
import { UserProfile } from '@/lib/types'
import Loader from './loader'
import SubmitButton from './elements/submit-button'

type FollowButtonProps = ButtonProps & {
	currentUserStr: string
	targetUserStr: string
	formProps?: React.FormHTMLAttributes<HTMLFormElement>
}

type ButtonData = {
	text: string
	action:
		| typeof follow
		| typeof unfollow
		| typeof sendFollowRequest
		| typeof unsendFollowRequest
	styles?: Record<string, string>
}

export default function FollowButton({
	currentUserStr,
	targetUserStr,
	formProps,
	...rest
}: FollowButtonProps) {
	const currentUser = useMemo(
		() => JSON.parse(currentUserStr),
		[currentUserStr]
	)
	const targetUser = useMemo(() => JSON.parse(targetUserStr), [targetUserStr])
	const buttonData = useMemo(() => {
		return determineButtonData(currentUser, targetUser)
	}, [currentUser, targetUser])

	return (
		<form
			action={buttonData?.action}
			{...formProps}
		>
			<input
				hidden
				readOnly
				name='currentUserId'
				value={currentUser?._id}
			/>
			<input
				hidden
				readOnly
				name='targetUserId'
				value={targetUser?._id}
			/>
			<SubmitButton
				size='xs'
				disabled={!buttonData}
				{...buttonData?.styles}
				{...rest}
			>
				{buttonData?.text || <Loader />}
			</SubmitButton>
		</form>
	)
}

function determineButtonData(
	currentUser: UserProfile,
	targetUser: UserProfile
): ButtonData {
	const isCurrentUserFollower = currentUser?.following?.includes(
		targetUser?._id
	)

	if (isCurrentUserFollower) {
		return {
			text: 'Following',
			action: unfollow,
			styles: {
				variant: 'dark'
			}
		}
	}

	if (targetUser.private) {
		const isFollowRequestSent = targetUser.followRequests?.includes(
			currentUser?._id
		)

		if (isFollowRequestSent) {
			return {
				text: 'Request Sent',
				action: unsendFollowRequest,
				styles: {
					variant: 'dark'
				}
			}
		}

		return {
			text: 'Follow',
			action: sendFollowRequest
		}
	}

	return {
		text: 'Follow',
		action: follow
	}
}
