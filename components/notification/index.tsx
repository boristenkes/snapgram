import Image from 'next/image'
import Link from 'next/link'
import Avatar from '../avatar'
import { Notification as NotificationType, User } from '@/lib/types'
import LikedPostContent from './notification-content/liked-post'
import NewCommentContent from './notification-content/new-comment'
import NewFollowerContent from './notification-content/new-follower'
import NewFollowRequestContent from './notification-content/new-follow-request'
import PostMentionContent from './notification-content/post-mention'

const notificationIcons = {
	LIKED_POST: '/assets/icons/like.svg',
	NEW_COMMENT: '/assets/icons/comment.svg',
	POST_MENTION: '/assets/icons/user-2.svg',
	NEW_FOLLOWER: '/assets/icons/user-2.svg',
	NEW_FOLLOW_REQUEST: '/assets/icons/user-2.svg'
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
		<div className='flex items-center gap-6 p-5 w-full max-w-3xl bg-neutral-600/30 rounded-xl relative'>
			<Image
				src={notificationIcons[notification.type]}
				alt=''
				width={36}
				height={36}
				className='bg-neutral-600 p-2 rounded-full aspect-square'
			/>

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
