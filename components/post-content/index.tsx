import Image from 'next/image'
import ErrorMessage from '../error-message'

type PostContentProps = {
	src: string
	alt?: string
	width: number
	height: number
	className?: string
}

const imageTypes = ['jpeg', 'jpg', 'png', 'webp']
const videoTypes = ['mp4', 'webm', 'ogg']

export default function PostContent({
	src,
	alt = '',
	width,
	height,
	className,
	...props
}: PostContentProps) {
	const contentType = src.split('.').at(-1) as string
	const isImage = imageTypes.includes(contentType)
	const isVideo = videoTypes.includes(contentType)

	// TODO: Find library for video component.

	return isImage ? (
		<Image
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={className}
			{...props}
		/>
	) : isVideo ? (
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
