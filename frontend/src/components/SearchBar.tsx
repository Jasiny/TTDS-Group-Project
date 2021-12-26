import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getSearchResults } from '../utils/api'

interface SearchBarProps {
	onResultsRetrieved: (results: GetSearchResultsResponseProps) => void
}

const SearchBar = ({ onResultsRetrieved }: SearchBarProps) => {
	const [input, setInput] = useState<string | undefined>()
	const [query, setQuery] = useState<string | undefined>()
	const { data: results } = useQuery(['search', query], () => getSearchResults(query), {
		enabled: !!query,
	})

	useEffect(() => {
		results && onResultsRetrieved(results)
	}, [results])

	return (
		<div className="w-3/4 text-right md:w-1/2">
			<div className="flex h-8 px-3 border border-gray-200 shadow rounded-2xl">
				<input
					type="text"
					className="flex-1 outline-none"
					onKeyDown={({ key }) => key === 'Enter' && setQuery(input)}
					onChange={({ target: { value } }) => setInput(value)}
				/>
				<button onClick={() => setQuery(input)}>🔍</button>
			</div>
			{results && <small className="p-1 text-gray-500">{`${results.time} seconds`}</small>}
		</div>
	)
}

export default SearchBar
