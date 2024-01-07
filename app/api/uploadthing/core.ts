import { getCurrentUser } from '@/lib/session'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

// const auth = (req: Request) => ({ id: 'fakeId' }) // Fake auth function

export const ourFileRouter = {
	profilePicture: f({ image: { maxFileSize: '2MB' } })
		.middleware(async ({ req }) => {
			// This code runs on your server before upload
			// const user = await auth(req)
			const { user } = await getCurrentUser()

			// If you throw, the user will not be able to upload
			if (!user) throw new Error('Unauthorized')

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			// @ts-ignore
			console.log('userId:', user?._id)
			return { userId: user?._id }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log('Upload complete for userId:', metadata.userId)

			console.log('file url', file.url)

			// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
			return { uploadedBy: metadata.userId }
		})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
