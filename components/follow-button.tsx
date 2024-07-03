import {
	follow,
	sendFollowRequest,
	unfollow,
	unsendFollowRequest
} from '@/lib/actions/user.actions'
import { TODO, User } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import SubmitButton from './elements/submit-button'
import Loader from './loader'
import { ButtonProps } from './ui/button'

export type FollowButtonProps = ButtonProps & {
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
	dark?: boolean
}

export default function FollowButton({
	currentUserStr,
	targetUserStr,
	formProps,
	className,
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
				size='lg'
				disabled={!buttonData}
				className={cn(
					buttonData.dark &&
						'bg-neutral-600 text-neutral-100 hover:bg-neutral-600/90',
					className
				)}
				{...rest}
			>
				{buttonData?.text || <Loader />}
			</SubmitButton>
		</form>
	)
}

function determineButtonData(currentUser: User, targetUser: User): ButtonData {
	const isCurrentUserFollower = currentUser?.following?.includes(
		targetUser?._id as TODO
	)

	if (isCurrentUserFollower) {
		return {
			text: 'Following',
			action: unfollow,
			dark: true
		}
	}

	if (targetUser.private) {
		const isFollowRequestSent = targetUser.followRequests?.includes(
			currentUser?._id as TODO
		)

		if (isFollowRequestSent) {
			return {
				text: 'Request Sent',
				action: unsendFollowRequest,
				dark: true
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
