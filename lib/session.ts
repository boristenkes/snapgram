import { getServerSession, type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@/lib/models/user.model'
import connectMongoDB from './mongoose'
import { SessionType, UserProfile } from './types'
import { getSession, signOut, useSession } from 'next-auth/react'
const bcrypt = require('bcrypt')

const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials) return null

				const { email, password } = credentials

				if (!email || !password) return null

				const user = await User.findOne({ email })

				if (!user) return null

				const passwordMatch = await bcrypt.compare(password, user.password)

				if (!passwordMatch) return null

				return user
			}
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		})
	],
	pages: {
		signIn: '/login'
	},
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === 'google') {
				const { name, email, image } = user

				try {
					connectMongoDB()
					if (await User.exists({ email })) {
						return true
					}

					// const username = email?.slice(0, email.indexOf('@'))
					const username = 'user_' + user.id
					const updatedUser = await User.findOneAndUpdate(
						{ email },
						{ email, name, username, image },
						{ upsert: true } // if user already exists, update user. else create new user
					)

					console.log('!!! updatedUser:', updatedUser)
				} catch (error) {
					console.log(
						'Error adding user signed in with Google provider to DB:',
						error
					)
				}
			}

			return true
		},
		session: async ({ session }) => {
			try {
				connectMongoDB()

				const dbUser = await User.findOne({ email: session?.user?.email })
				const newSession = {
					...session,
					user: {
						...session.user,
						...dbUser?._doc
					}
				}
				return newSession
			} catch (error) {
				console.error('Error in session callback:', error)
			}

			return session
		}
	}
}

export async function getCurrentUser() {
	const session = (await getServerSession(authOptions)) as SessionType

	return session
}

export default authOptions
