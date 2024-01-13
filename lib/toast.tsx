import Image from 'next/image'
import { toast } from 'react-hot-toast'

type ToastProps = {
	iconUrl?: string
	iconAlt?: string
	style?: React.CSSProperties
}

export default function darkToast(
	message: string,
	{ iconUrl = '/assets/icons/check.svg', iconAlt = '', style }: ToastProps = {}
) {
	return toast(message, {
		icon: (
			<Image
				src={iconUrl}
				alt={iconAlt}
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
