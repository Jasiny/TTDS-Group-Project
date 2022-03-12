import { Alert, CircularProgress, Snackbar, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getSearchResults } from '../utils/api'

interface SearchBarProps {
	onResultsRetrieved: (results: GetSearchResultsResponseProps) => void
}

const SearchBar = ({ onResultsRetrieved }: SearchBarProps) => {
	const [input, setInput] = useState<string | undefined>()
	const [query, setQuery] = useState<string | undefined>()
	const [showErrorMsg, setShowErrorMsg] = useState(false)
	const {
		data: results,
		isError,
		isLoading,
	} = useQuery(['search', query], () => getSearchResults(query), {
		retry: false,
		enabled: !!query,
	})

	useEffect(() => {
		isError && setShowErrorMsg(true)
		results && onResultsRetrieved(results)
	}, [results, isError])

	return (
		<div className="w-3/4 text-right md:w-1/2">
			<div className="flex h-8 px-3 border border-gray-200 shadow rounded-2xl">
				<input
					type="text"
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
			</div>
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
