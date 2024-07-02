'use client'

import { Fragment, useState } from 'react'
import Tag from './tag'

type Props = {
	caption: string
	tags: string[]
}

export default function Caption({ caption, tags }: Props) {
	if (!caption && !tags.length) return

	const [viewMore, setViewMore] = useState(false)

	return (
		<pre className='font-inherit mb-8 text-wrap text-sm sm:text-base'>
			{viewMore ? caption : caption.slice(0, 100)}
			{!viewMore && caption.length > 100 && (
				<button
					onClick={() => setViewMore(true)}
					className='text-primary-500 font-semibold hover:text-primary-400'
				>
					...more
				</button>
			)}
			{!!caption.length && !!tags.length && (
				<>
					<br />
					<br />
				</>
			)}
			{tags.map(tag => (
				<Fragment key={tag}>
					<Tag tag={tag} />{' '}
				</Fragment>
			))}
		</pre>
	)
}
