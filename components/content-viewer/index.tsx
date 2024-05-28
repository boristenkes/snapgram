import Image from 'next/image'
import ErrorMessage from '../error-message'
import { isImage, isVideo } from '@/lib/utils'

type PostContentProps = {
	src: string
	alt?: string
	width: number
	height: number
	className?: string
}

export default function ContentViewer({
	src,
	alt = '',
	width,
	height,
	className,
	...props
}: PostContentProps) {
	const contentType = src.split('.').at(-1) as string

	// TODO: Find library for video component.

	return isImage(src) ? (
		<Image
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={className}
			{...props}
		/>
	) : isVideo(src) ? (
		<video
			width={width}
			height={height}
			className={className}
			controls
			autoPlay
			muted
			{...props}
		>
			<source
				src={src}
				type={`video/${contentType}`}
			/>
			Your browser does not support video tag.
		</video>
	) : (
		<ErrorMessage message={`Invalid content type (${contentType}): ${src}`} />
	)
}
