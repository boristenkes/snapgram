'use client'

import { Button, type ButtonProps } from './elements'
import {
	getUserById,
	follow,
	unfollow,
	sendFollowRequest,
	unsendFollowRequest
} from '@/lib/actions/user.actions'
import { useEffect, useMemo, useState } from 'react'
import { UserProfile } from '@/lib/types'
import Loader from './loader'
import darkToast from '@/lib/toast'

type FollowButtonProps = ButtonProps & {
	currentUserStr: string
	targetUserStr: string
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
	...rest
}: FollowButtonProps) {
	const currentUser = useMemo(
		() => JSON.parse(currentUserStr),
		[currentUserStr]
	)
	const targetUser = useMemo(() => JSON.parse(targetUserStr), [targetUserStr])

	const [targetUserProfile, setTargetUserProfile] =
		useState<UserProfile | null>(null)
	const [buttonData, setButtonData] = useState<ButtonData>()

	useEffect(() => {
		;(async () => {
			const user = await getUserById(
				targetUser?._id,
				'followers followRequests following username private'
			)

			if (typeof user === 'string') {
				setTargetUserProfile(JSON.parse(user))
			}
		})()
	}, [currentUser, targetUser])

	useEffect(() => {
		if (!targetUserProfile) return

		const buttondata = determineButtonData(currentUser, targetUser)

		setButtonData(buttondata)
	}, [targetUserProfile])

	const handleClick = async () => {
		const resp = await buttonData?.action(currentUser._id, targetUser._id)

		if (resp?.error)
			darkToast(resp.error, {
				iconUrl: '/assets/icons/error.svg',
				iconAlt: 'Error'
			})
	}

	return (
		<Button
			onClick={handleClick}
			size='xs'
			disabled={!buttonData}
			{...buttonData?.styles}
			{...rest}
		>
			{buttonData?.text || <Loader />}
		</Button>
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
