'use client'

import { useState, useEffect } from 'react'
import useDebounce from '@/hooks/use-debounce'
import { searchUsers } from '@/lib/actions/user.actions'
import { removeDuplicates } from '@/lib/utils'
import { SearchResult } from '@/components/search'
import Avatar from '@/components/avatar'
import Loader from '@/components/loader'

const MAX_MENTIONS = 10

export type Mention = SearchResult

type MentionInputProps = {
	mentions: Mention[]
	setMentions: React.Dispatch<React.SetStateAction<Mention[]>>
}

export default function MentionInput({
	mentions,
	setMentions
}: MentionInputProps) {
	const [value, setValue] = useState('')
	const [searchResults, setSearchResults] = useState<Mention[] | null>(null)
	const { debouncedValue, isPending } = useDebounce(value)

	useEffect(() => {
		const fetchSearchResults = async () => {
			if (!debouncedValue.length) {
				setSearchResults(null)
				return
			}

			const stringifiedResults = await searchUsers(value)
			const parsedResults: Mention[] = JSON.parse(stringifiedResults || '[]')

			setSearchResults(
				// Filter out users that are already mentioned
				parsedResults.filter(
					user => !mentions.some(mention => mention._id === user._id)
				)
			)
		}

		fetchSearchResults()
	}, [debouncedValue])

	const handleMentionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value

		if (!val.trim().length || mentions.length === MAX_MENTIONS) {
			setSearchResults(null)
			setValue('')
			return
		}

		if (!val.endsWith(' ')) {
			setValue(val)
			return
		}

		if (!searchResults || !searchResults.length) return

		setValue('')
		setMentions(prev =>
			removeDuplicates([...prev, { ...searchResults[0] }], 'username')
		)
	}

	const removeMention = (targetUsername: string) => {
		setMentions(prev =>
			prev.filter(({ username }) => username !== targetUsername)
		)
	}

	const handleSearchResultClick = (user: Mention) => {
		setMentions(prev => removeDuplicates([...prev, { ...user }], 'username'))
		setValue('')
		setSearchResults(null)
	}

	return (
		<div className='space-y-2'>
			<label
				htmlFor='mentions'
				className='cursor-text'
			>
				Mention other users
				<p className='mb-2 text-sm text-neutral-500'>Separated by space</p>
				<div className='relative flex flex-wrap w-full p-3 mt-2 space-x-2 rounded-lg bg-neutral-600 disabled:brightness-75'>
					{mentions.map(mention => (
						<button
							onClick={() => removeMention(mention.username)}
							key={mention.username}
							type='button'
							className='flex items-center gap-1 p-1 pr-3 my-1 text-sm rounded-md bg-neutral-800'
							aria-label={`mention: ${mention}. click to remove`}
						>
							<Avatar
								url={mention.image}
								alt={mention.name}
								width={22}
								height={22}
							/>
							{mention.username}
						</button>
					))}

					<input
						id='mentions'
						name='mentions'
						value={value}
						onChange={handleMentionInput}
						autoComplete='off'
						disabled={mentions.length === MAX_MENTIONS}
						className='bg-transparent outline-none w-fit'
					/>
					{isPending && (
						<Loader className='absolute mx-auto my-2 top-2 right-10' />
					)}
				</div>
			</label>
			{searchResults !== null && (
				<ul className='overflow-hidden rounded-lg bg-neutral-700'>
					{!searchResults.length ? (
						<li className='py-1.5 px-2'>
							<em className='text-primary-700'>No results</em>
						</li>
					) : (
						searchResults.map(user => (
							<li
								key={user.username}
								className='flex items-center gap-2 py-1.5 px-2 cursor-pointer transition-colors hover:bg-neutral-600'
								onClick={() => handleSearchResultClick(user)}
							>
								<Avatar
									url={user.image}
									width={40}
								/>
								<p className='grid flex-1'>
									<strong>{user.name}</strong>
									<span className='text-sm'>{user.username}</span>
								</p>
							</li>
						))
					)}
				</ul>
			)}
			<p className='ml-auto text-sm w-fit'>
				{mentions.length} / {MAX_MENTIONS}
			</p>
		</div>
	)
}
