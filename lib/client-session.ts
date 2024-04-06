'use client'

import { useSession } from 'next-auth/react'

export default function clientSession() {
	const session = useSession()
	// @ts-ignore
	const { user } = session.data
	return { session, user }
}
