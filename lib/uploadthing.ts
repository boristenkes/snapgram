import { generateReactHelpers } from '@uploadthing/react/hooks'

import type { OurFileRouter } from '@/app/api/uploadthing/core'

import { UTApi } from 'uploadthing/server'

export const uploadthingApi = new UTApi()

export const { useUploadThing, uploadFiles } =
	generateReactHelpers<OurFileRouter>()