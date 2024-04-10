'use client'

import Image from 'next/image'
import SearchInput from './search-input'
import { useState } from 'react'
import Link from 'next/link'
import Avatar from '../avatar'
import { searchUsers } from '@/lib/actions/user.actions'

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement> & {}
export type SearchResult = {
	_id: string
	name: string
	username: string
	image: string
}

export default function Search({ ...rest }: SearchProps) {
	const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
		null
	)

	return (
		<div className='flex gap-4 bg-neutral-700 p-3 rounded-2xl relative border-2 border-transparent has-[input:focus]:border-neutral-100'>
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
					<ul className='absolute top-full left-0 w-full bg-neutral-700 mt-3 p-4 space-y-4 rounded-lg shadow-xl'>
						{!!searchResults?.length ? (
							searchResults.map(item => (
								<li key={item.username}>
									<Link
										href={`/profile/${item.username}`}
										className='flex items-center gap-2'
									>
										<Avatar
											url={item.image}
											width={40}
										/>
										<div className='flex-1 grid'>
											<strong>{item.name}</strong>
											<small>{item.username}</small>
										</div>
									</Link>
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
