type ModalProps = {
	children: React.ReactNode
}

export default function Modal({ children }: ModalProps) {
	return (
		<div className='fixed inset-0 z-50 grid place-content-center bg-neutral-800/80 animate-slide-in'>
			<div>{children}</div>
		</div>
	)
}
