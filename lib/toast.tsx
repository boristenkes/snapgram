import Image from 'next/image'
import { toast as hotToast } from 'react-hot-toast'

type ToastProps = {
	type?: 'success' | 'error'
	iconUrl?: string
	iconAlt?: string
	style?: React.CSSProperties
}

export default function toast(
	message: string,
	{ type = 'success', iconUrl, iconAlt, style }: ToastProps = {}
) {
	const src =
		iconUrl ?? type === 'success'
			? '/assets/icons/check.svg'
			: '/assets/icons/error.svg'

	return hotToast(message, {
		icon: (
			<Image
				src={src}
				alt={iconAlt ?? type}
				width={20}
				height={20}
			/>
		),
		style: {
			borderRadius: '8px',
			background: '#333',
			color: '#fff',
			...style
		}
	})
}
