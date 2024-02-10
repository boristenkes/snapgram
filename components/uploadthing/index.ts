import { OurFileRouter } from '@/app/api/uploadthing/core'
import { generateUploadDropzone } from '@uploadthing/react'

export const UploadDropzone = generateUploadDropzone<OurFileRouter>()
