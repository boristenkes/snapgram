import Image from 'next/image'

type AvatarProps = {
	url: string | null | undefined
	alt?: string
	width: number
	height?: number
	className?: string
}

export default function Avatar({
	url,
	alt = 'Profile picture',
	width,
	height,
	className = ''
}: AvatarProps) {
	return (
		<Image
			src={url || '/assets/default.jpg'}
			alt={alt}
			width={width}
			height={height || width}
			className={`rounded-full aspect-square bg-neutral-600 ${className}`}
		/>
	)
}
