import { getServerSession, type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@/lib/models/user.model'
import connectMongoDB from './mongoose'
import { SessionType } from './types'
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
				if (!credentials) {
					throw new Error('Crentials not provided')
				}

				const { email, password } = credentials

				if (!email || !password) {
					throw new Error('Email and password are required')
				}

				const user = await User.findOne({ email })

				if (!user) {
					throw new Error('User with this email does not exist')
				}

				if (!user.password) {
					throw new Error(
						'This email was originally registered with Google provider'
					)
				}

				const passwordMatch = await bcrypt.compare(password, user.password)

				if (!passwordMatch) {
					throw new Error('Invalid password. Please try again')
				}

				return user
			}
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		})
	],
	pages: {
		signIn: '/login',
		newUser: '/register'
	},
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === 'google') {
				const { name, email, image } = user

				try {
					await connectMongoDB()
					if (await User.exists({ email })) {
						return true
					}

					await User.findOneAndUpdate(
						{ email },
						{ email, name, image },
						{ upsert: true } // if user already exists, update user. else create new user
					)
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
				await connectMongoDB()

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

	return JSON.parse(JSON.stringify(session))
}

export default authOptions
