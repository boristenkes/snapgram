'use client'

import { type User } from '@/lib/types'
import { useSession } from 'next-auth/react'
// import { useEffect, useState } from 'react'

export default function useAuth() {
	const session = useSession()
	// const [session, setSession] = useState(clientSession)

	// useEffect(() => setSession(clientSession), [clientSession])

	return { session, user: session.data?.user as User }
}
