'use client'

import Image from 'next/image'
import SearchInput from './search-input'
import { useState } from 'react'
import { searchUsers } from '@/lib/actions/user.actions'
import UserCard from '../user-card'
import { User } from '@/lib/types'
import { cn } from '@/lib/utils'

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement> & {
	wrapperClassName?: string
}
export type SearchResult = {
	_id: string
	name: string
	username: string
	image: string
}

export default function Search({ wrapperClassName, ...rest }: SearchProps) {
	const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
		null
	)

	return (
		<div
			className={cn(
				'flex gap-4 bg-neutral-700 p-3 rounded-2xl relative border-2 border-transparent has-[input:focus]:border-neutral-100',
				wrapperClassName
			)}
		>
			<Image
				src='/assets/icons/search.svg'
				alt=''
				width={24}
				height={24}
			/>

			<div className='flex-1'>
				<SearchInput
					handleSearch={searchUsers}
					setSearchResults={setSearchResults}
					{...rest}
				/>
				{searchResults !== null && (
					<ul className='absolute top-full left-0 w-full bg-neutral-700 mt-3 p-2 rounded-lg shadow-xl'>
						{!!searchResults?.length ? (
							(searchResults as User[]).map(item => (
								<li key={item.username}>
									<UserCard user={item} />
								</li>
							))
						) : (
							<li>
								<em className='text-primary-700'>No results</em>
							</li>
						)}
					</ul>
				)}
			</div>
		</div>
	)
}
