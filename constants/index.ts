import { deepFreeze } from '@/lib/utils'

export const sidebarLinks = [
	{
		title: 'Home',
		path: '/',
		icon: {
			default: '/assets/icons/home-primary.svg',
			active: '/assets/icons/home-neutral.svg'
		}
	},
	{
		title: 'Explore',
		path: '/explore',
		icon: {
			default: '/assets/icons/explore-primary.svg',
			active: '/assets/icons/explore-neutral.svg'
		}
	},
	{
		title: 'Notifications',
		path: '/notifications',
		icon: {
			default: '/assets/icons/notifications-primary.svg',
			active: '/assets/icons/notifications-neutral.svg'
		}
	},
	{
		title: 'Chats',
		path: '/chats',
		icon: {
			default: '/assets/icons/chats-primary.svg',
			active: '/assets/icons/chats-neutral.svg'
		}
	},
	{
		title: 'Create Post',
		path: '/post/new',
		icon: {
			default: '/assets/icons/create-post-primary.svg',
			active: '/assets/icons/create-post-neutral.svg'
		}
	}
]

deepFreeze(sidebarLinks)

export const topbarLinks = [
	{
		title: 'Create Post',
		path: '/post/new',
		icon: {
			default: '/assets/icons/create-post-primary.svg',
			active: '/assets/icons/create-post-neutral.svg'
		}
	},

	{
		title: 'Notifications',
		path: '/notifications',
		icon: {
			default: '/assets/icons/notifications-primary.svg',
			active: '/assets/icons/notifications-neutral.svg'
		}
	},
	{
		title: 'Settings',
		path: '/settings',
		icon: {
			active: '/assets/icons/settings-neutral.svg',
			default: '/assets/icons/settings-primary.svg'
		}
	}
]

deepFreeze(topbarLinks)

export const bottombarLinks = [
	{
		title: 'Home',
		path: '/',
		icon: {
			default: '/assets/icons/home-primary.svg',
			active: '/assets/icons/home-neutral.svg'
		}
	},
	{
		title: 'Explore',
		path: '/explore',
		icon: {
			default: '/assets/icons/explore-primary.svg',
			active: '/assets/icons/explore-neutral.svg'
		}
	},
	{
		title: 'Chats',
		path: '/chats',
		icon: {
			default: '/assets/icons/chats-primary.svg',
			active: '/assets/icons/chats-neutral.svg'
		}
	}
]

deepFreeze(bottombarLinks)

export const imageTypes = ['jpeg', 'jpg', 'png', 'webp']
export const videoTypes = ['mp4', 'webm', 'ogg']

export const notificationTypes = [
	'LIKED_POST',
	'NEW_COMMENT',
	'POST_MENTION',
	'NEW_FOLLOWER',
	'NEW_FOLLOW_REQUEST'
]
