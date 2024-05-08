'use client'

import { type User } from '@/lib/types'
import { useSession } from 'next-auth/react'

export default function useAuth() {
	const session = useSession()

	const user = session.data?.user as User

	return { session, user }
}
