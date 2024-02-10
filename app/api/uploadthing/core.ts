import { getCurrentUser } from '@/lib/session'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

const profilePicture = f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
	.middleware(async ({ req }) => {
		const { user } = await getCurrentUser()

		if (!user) throw new Error('Unauthorized')

		return { userId: user?._id }
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
		const { user } = await getCurrentUser()

		if (!user) throw new Error('Unauthrized')

		return { userId: user?._id }
	})
	.onUploadComplete(async ({ metadata, file }) => {})

export const ourFileRouter = {
	profilePicture,
	storyContent
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
