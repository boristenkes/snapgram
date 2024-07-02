import { Notification as NotificationType, User } from '@/lib/types'
import { Heart, MessageCircleMore, UserRound } from 'lucide-react'
import Link from 'next/link'
import Avatar from '../avatar'
import LikedPostContent from './notification-content/liked-post'
import NewCommentContent from './notification-content/new-comment'
import NewFollowRequestContent from './notification-content/new-follow-request'
import NewFollowerContent from './notification-content/new-follower'
import PostMentionContent from './notification-content/post-mention'

const iconSize = 20

const notificationIcons = {
	LIKED_POST: <Heart size={iconSize} />,
	NEW_COMMENT: <MessageCircleMore size={iconSize} />,
	POST_MENTION: <UserRound size={iconSize} />,
	NEW_FOLLOWER: <UserRound size={iconSize} />,
	NEW_FOLLOW_REQUEST: <UserRound size={iconSize} />
}

type NotificationProps = {
	notification: NotificationType
}

export default async function Notification({
	notification
}: NotificationProps) {
	const sender = notification.sender as User
	const senderName = (sender.name || sender.username).split(' ')[0]

	return (
		<div className='flex items-center gap-3 sm:gap-6 p-3 sm:p-5 w-full max-w-3xl bg-neutral-600/30 rounded-xl relative'>
			<div className='bg-neutral-600 text-primary-500 p-2 rounded-full aspect-square'>
				{notificationIcons[notification.type]}
			</div>

			<div className='flex items-center gap-3 w-full'>
				<Link
					href={`/profile/${sender.username}`}
					className='flex-none'
				>
					<Avatar
						url={sender.image}
						alt={sender.name}
						width={60}
						className='w-12 lg:w-16'
					/>
				</Link>

				{notification.type === 'LIKED_POST' ? (
					<LikedPostContent
						senderName={senderName}
						createdAt={notification.createdAt}
						postId={notification.postId}
					/>
				) : notification.type === 'NEW_COMMENT' ? (
					<NewCommentContent
						senderName={senderName}
						createdAt={notification.createdAt}
						commentContent={notification.commentContent}
						postId={notification.postId}
					/>
				) : notification.type === 'NEW_FOLLOWER' ? (
					<NewFollowerContent
						senderName={senderName}
						createdAt={notification.createdAt}
						senderId={sender._id}
						recipientId={notification.recipient as string}
					/>
				) : notification.type === 'NEW_FOLLOW_REQUEST' ? (
					<NewFollowRequestContent
						senderName={senderName}
						createdAt={notification.createdAt}
						senderId={sender._id}
						recipientId={notification.recipient as string}
					/>
				) : (
					notification.type === 'POST_MENTION' && (
						<PostMentionContent
							senderName={senderName}
							createdAt={notification.createdAt}
							postId={notification.postId}
						/>
					)
				)}

				{!notification.seen && (
					<div className='absolute top-0 right-0 bg-primary-600 font-semibold px-2 rounded-lg text-xs'>
						new
					</div>
				)}
			</div>
		</div>
	)
}
