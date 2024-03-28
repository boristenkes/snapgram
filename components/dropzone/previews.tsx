'use client'

import { id } from '@/lib/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type PreviewsProps = {
	files: File[]
	initialPreviews?: Preview[]
}

export type Preview = {
	id: string
	url: string
	alt: string
}

export default function Previews({ files, initialPreviews }: PreviewsProps) {
	const [previews, setPreviews] = useState<Preview[]>(initialPreviews ?? [])

	useEffect(() => {
		if (!files.length) return

		const readFiles = async () => {
			const newPreviews = await Promise.all(
				files.map(async file => {
					const result = await new Promise<string>(resolve => {
						const fileReader = new FileReader()

						fileReader.onload = event => {
							resolve(event.target?.result?.toString() || '')
						}

						fileReader.readAsDataURL(file)
					})

					return {
						id: id(),
						url: result,
						alt: file.name
					}
				})
			)

			setPreviews(prev => [...prev, ...newPreviews])
		}

		readFiles()
	}, [files])

	return (
		!!previews.length && (
			<ul className='flex items-center gap-2 flex-nowrap overflow-x-auto custom-scrollbar'>
				{previews.map(preview => (
					<li
						key={preview.id}
						className='relative isolate flex-none'
					>
						<Image
							src={preview.url}
							alt={preview.alt}
							width={80}
							height={80}
							className='rounded-lg overflow-hidden border p-px aspect-square object-cover'
						/>
					</li>
				))}
			</ul>
		)
	)
}
