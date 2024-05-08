'use client'

import useAuth from '@/hooks/use-auth'
import { countNotifications } from '@/lib/actions/notification.actions'
import { useEffect, useState } from 'react'

export default function UnreadNotificationCounter() {
	const { user: currentUser } = useAuth()
	const [count, setCount] = useState(0)

	useEffect(() => {
		const fetchCount = async () => {
			const response = await countNotifications({
				recipient: currentUser._id,
				seen: false
			})

			if (!response.success) return

			setCount(response.count)
		}

		if (currentUser._id) fetchCount()
	}, [currentUser])

	if (count === 0) return

	return (
		<div className='absolute top-1/2 right-3 -translate-y-1/2 bg-secondary-500 text-neutral-700 text-xs font-semibold px-1.5 py-0.5 rounded-md shadow-[0px_0px_6px_2px_rgba(219,188,159,0.3)]'>
			{count <= 9 ? count : '9+'}
		</div>
	)
}
