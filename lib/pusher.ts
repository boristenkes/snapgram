import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
	appId: process.env.PUSHER_APP_ID!,
	cluster: 'eu',
	key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
	secret: process.env.PUSHER_SECRET!,
	useTLS: true
})

export const pusherClient = new PusherClient(
	process.env.NEXT_PUBLIC_PUSHER_KEY!,
	{
		cluster: 'eu'
	}
)
