'use client'

import { id } from '@/lib/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type PreviewsProps = {
	files: File[]
	initialPreviews?: Preview[]
}

export type Preview = {
	url: string
	alt: string
}

export default function Previews({ files, initialPreviews }: PreviewsProps) {
	const [previews, setPreviews] = useState<Preview[]>(initialPreviews ?? [])

	useEffect(() => {
		if (!files.length) return

		setPreviews(
			files.map(file => ({
				url: URL.createObjectURL(file),
				alt: file.name
			}))
		)

		return () => previews.forEach(({ url }) => URL.revokeObjectURL(url))
	}, [files])

	return (
		!!previews.length && (
			<ul className='flex items-center gap-2'>
				{previews.map(preview => (
					<li
						key={id()}
						className='relative isolate'
					>
						<div className='absolute inset-0 bg-neutral-700 animate-pulse -z-10' />
						<Image
							src={preview.url}
							alt={preview.alt}
							width={80}
							height={80}
							className='rounded-lg overflow-hidden border p-px aspect-square object-cover'
							onLoad={() => URL.revokeObjectURL(preview.url)}
						/>
					</li>
				))}
			</ul>
		)
	)
}
