'use client'

import { useSession } from 'next-auth/react'

export default function clientSession() {
	const session = useSession()
	return { session, user: session.data?.user }
}
