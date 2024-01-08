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
				console.log('----- authorize -----')
				console.log('credentials:', credentials)
				if (!credentials) return null

				const { email, password } = credentials
				console.log('email:', email)
				console.log('password:', password)

				if (!email || !password) return null

				const user = await User.findOne({ email })
				console.log('user:', user)

				if (!user) return null

				const passwordMatch = await bcrypt.compare(password, user.password)
				console.log('passwordMatch:', passwordMatch)

				if (!passwordMatch) return null

				console.log('---------------------')
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

	return session
}

export default authOptions
