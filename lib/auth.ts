import { getServerSession } from 'next-auth'
import { cache } from 'react'
import authOptions from './session'
import { type SessionType } from './types'
import { serialize } from './utils'

async function auth() {
	const session = (await getServerSession(authOptions)) as SessionType

	return serialize(session)
}

export default cache(auth)
