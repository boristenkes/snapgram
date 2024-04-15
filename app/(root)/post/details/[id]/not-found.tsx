import Link from 'next/link'

export default function PostNotFound() {
	return (
		<div>
			Post not found
			<Link href='/'>Back to home</Link>
		</div>
	)
}
