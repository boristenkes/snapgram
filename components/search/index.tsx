import Image from 'next/image'
import SearchInput from './search-input'
import { searchUsers } from '@/lib/actions/user.actions'

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement> & {}

export default function Search({ ...rest }: SearchProps) {
	const handleSearchAction = async (formData: FormData) => {
		'use server'

		const searchTerm = formData.get('search') as string

		searchUsers(searchTerm)
	}

	return (
		<div className='flex gap-4 bg-neutral-700 p-3 rounded-2xl relative'>
			<Image
				src='/assets/icons/search.svg'
				alt=''
				width={24}
				height={24}
			/>
			<form
				action={handleSearchAction}
				className='flex-1'
			>
				<label
					htmlFor='search-users'
					className='sr-only'
				>
					Search users
				</label>
				<SearchInput
					handleSearch={searchUsers}
					id='search-users'
					{...rest}
				/>
			</form>
		</div>
	)
}
