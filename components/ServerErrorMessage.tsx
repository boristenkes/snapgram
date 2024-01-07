import { cn } from '@/lib/utils'
import Image from 'next/image'

type ServerErrorMessageProps = {
	message: string
	className?: string
}

export default function ServerErrorMessage({
	message,
	className
}: ServerErrorMessageProps) {
	return (
		<p
			className={cn(
				'bg-semantic-danger/40 p-2 rounded-lg my-6 flex items-center gap-2',
				className
			)}
		>
			<Image
				src='/assets/icons/error.svg'
				alt=''
				width={18}
				height={18}
			/>
			{message}
		</p>
	)
}
