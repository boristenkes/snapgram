import Image from 'next/image'
import { Renderable, toast } from 'react-hot-toast'

type ToastProps = {
	icon?: Renderable | undefined
	style?: React.CSSProperties
}

export default function darkToast(
	message: string,
	{
		icon = (
			<Image
				src='/assets/icons/check.svg'
				alt=''
				width={20}
				height={20}
			/>
		),
		style
	}: ToastProps = {}
) {
	return toast(message, {
		icon,
		style: {
			borderRadius: '8px',
			background: '#333',
			color: '#fff',
			...style
		}
	})
}
