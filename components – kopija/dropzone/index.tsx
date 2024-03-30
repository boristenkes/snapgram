'use client'

import { useUploadThing } from '@/lib/uploadthing'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { DropzoneOptions } from 'react-dropzone'
import { generateClientDropzoneAccept } from 'uploadthing/client'
import Errors from './errors'
import Previews, { type Preview } from './previews'

type ImageUploadProps = {
	endpoint: 'profilePicture' | 'storyContent' | 'postContent'
	dropzoneOptions: DropzoneOptions
	label?: React.ReactNode
	initialPreviews?: Preview[]
	name?: string
}

export default function Dropzone({
	endpoint,
	label = "Drag 'n' drop files here or click to browse",
	dropzoneOptions,
	initialPreviews,
	name
}: ImageUploadProps) {
	const { permittedFileInfo } = useUploadThing(endpoint)

	const fileTypes = permittedFileInfo?.config
		? generateClientDropzoneAccept(Object.keys(permittedFileInfo?.config))
		: undefined

	const { getRootProps, getInputProps, acceptedFiles, fileRejections } =
		useDropzone({
			accept: fileTypes,
			...dropzoneOptions
		})

	return (
		<div>
			<div
				{...getRootProps()}
				className={cn(
					'relative flex items-stretch w-full px-10 overflow-hidden rounded-lg cursor-pointer min-h-40 bg-neutral-600',
					{
						'border-2 border-semantic-danger':
							!!fileRejections?.length && !acceptedFiles.length
					}
				)}
			>
				<span
					className={cn(
						'absolute inset-0 grid place-items-center cursor-pointer text-center px-4',
						{ 'sr-only': initialPreviews?.length || acceptedFiles.length }
					)}
				>
					{label}
				</span>
				<input
					name={name}
					{...getInputProps()}
				/>

				<Previews
					files={acceptedFiles}
					initialPreviews={initialPreviews}
				/>
			</div>

			<Errors fileRejections={fileRejections} />
		</div>
	)
}
