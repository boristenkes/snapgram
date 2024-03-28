type ModalProps = {
	isOpen: boolean
	children: React.ReactNode
}

export default function Modal({ isOpen, children }: ModalProps) {
	return (
		isOpen && (
			<div className='fixed inset-0 z-50 grid place-content-center bg-neutral-800/80'>
				<div className='animate-slide-in'>{children}</div>
			</div>
		)
	)
}
