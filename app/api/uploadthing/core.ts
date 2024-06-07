import auth from '@/lib/auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

const profilePicture = f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
	.middleware(async ({ req }) => {
		const session = await auth()

		if (!session) throw new Error('Unauthorized')

		return { userId: session?.user?._id }
	})
	.onUploadComplete(async ({ metadata, file }) => {
		console.log('Upload complete for userId:', metadata.userId)
		console.log('file url', file.url)

		return { uploadedBy: metadata.userId }
	})

const storyContent = f({
	image: { maxFileSize: '4MB' },
	video: { maxFileSize: '8MB' }
})
	.middleware(async ({ req }) => {
		const session = await auth()

		if (!session) throw new Error('Unauthorized')

		return { userId: session?.user?._id }
	})
	.onUploadComplete(async ({ metadata, file }) => {})

const postContent = f({
	image: { maxFileSize: '4MB', maxFileCount: 10 },
	video: { maxFileSize: '8MB', maxFileCount: 10 }
})
	.middleware(async ({ req }) => {
		const session = await auth()

		if (!session) throw new Error('Unauthorized')

		return { userId: session?.user?._id }
	})
	.onUploadComplete(async ({ metadata, file }) => {})

export const ourFileRouter = {
	profilePicture,
	storyContent,
	postContent
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
