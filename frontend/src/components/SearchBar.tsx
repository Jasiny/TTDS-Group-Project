import { Alert, CircularProgress, Snackbar, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getSearchResults } from '../utils/api'
import { EngineType } from '../utils/enums'

interface SearchBarProps {
	engine: EngineType
	example: string | undefined
	onResultsRetrieved: (results: GetSearchResultsResponseProps) => void
}

const SearchBar = ({ engine, example, onResultsRetrieved }: SearchBarProps) => {
	const [input, setInput] = useState<string | undefined>()
	const [query, setQuery] = useState<string | undefined>()
	const [showErrorMsg, setShowErrorMsg] = useState(false)
	const {
		data: results,
		isError,
		isLoading,
		refetch,
	} = useQuery('search', () => getSearchResults(query, engine), {
		retry: false,
		enabled: false,
	})

	useEffect(() => {
		query && engine && refetch()
	}, [query, engine])

	useEffect(() => {
		isError && setShowErrorMsg(true)
		results && onResultsRetrieved(results)
	}, [results, isError])

	useEffect(() => {
		if (example) {
			setInput(example)
			setQuery(example)
		}
	}, [example])

	return (
		<div className="w-3/4 text-right md:w-1/2">
			<form
				onSubmit={(e) => {
					e.preventDefault()
					query && engine && refetch()
				}}
				className="flex h-8 px-3 border border-gray-200 shadow rounded-2xl"
			>
				<input
					autoFocus
					type="text"
					value={input || ''}
					className="flex-1 outline-none"
					onKeyDown={({ key }) => key === 'Enter' && setQuery(input)}
					onChange={({ target: { value } }) => setInput(value)}
				/>
				<button className="flex items-center" onClick={() => setQuery(input)}>
					{isLoading ? (
						<CircularProgress
							className="text-gray-500 cursor-not-allowed"
							style={{ width: '20px', height: '20px' }}
							color="inherit"
						/>
					) : (
						<span>🔍</span>
					)}
				</button>
			</form>
			{results && <small className="p-1 text-gray-500">{`${results.time} seconds`}</small>}
			<Snackbar
				open={showErrorMsg}
				autoHideDuration={3000}
				onClose={() => setShowErrorMsg(false)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Stack sx={{ width: '100%' }} spacing={2}>
					<Alert severity="error">Error happened!</Alert>
				</Stack>
			</Snackbar>
		</div>
	)
}

export default SearchBar
