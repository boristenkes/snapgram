import { getServerSession } from 'next-auth'
import { cache } from 'react'
import authOptions from './session'
import { type SessionType } from './types'

async function auth() {
	const session = (await getServerSession(authOptions)) as SessionType

	return JSON.parse(JSON.stringify(session))
}

export default cache(auth)
