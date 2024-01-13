import { cn } from '@/lib/utils'
import Image from 'next/image'

type ProfilePictureProps = {
	url: string | undefined | null
	alt?: string
	width: number
	height?: number
	onLoad?: () => void
	className?: string
	priority?: boolean
}

export default function ProfilePicture({
	url,
	alt = 'Profile picture',
	width,
	height,
	className = '',
	priority,
	...rest
}: ProfilePictureProps) {
	return (
		<Image
			src={url || '/assets/default.jpg'}
			alt={alt}
			width={width}
			height={height || width}
			className={cn(
				'rounded-full aspect-square object-cover bg-neutral-600',
				className
			)}
			priority={priority}
			{...rest}
		/>
	)
}
