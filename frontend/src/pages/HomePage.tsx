import React, { useState } from 'react'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import SettingButton from '../components/SettingButton'
import { EngineType, POSType, WordType } from '../utils/enums'

const HomePage = () => {
	const [results, setResults] = useState<GetSearchResultsResponseProps>()
	const [example, setExample] = useState<string>()
	const [filter, setFilter] = useState({
		engineType: EngineType.Neural,
		wordType: WordType.All,
		posType: POSType.All,
	})

	const handleResultsRetrieved = (results: GetSearchResultsResponseProps) => setResults(results)

	const handleFilterChanged = (filter: FilterProps) => setFilter(filter)

	return (
		<main className="relative flex flex-col items-center mb-24 space-y-4 sm:space-y-6">
			{/* setting button at right top corner */}
			<div className="absolute right-4 top-1">
				<SettingButton onExampleClicked={(example) => setExample(example)} />
			</div>
			{/* logo */}
			<div
				onClick={() => location.reload()}
				style={{ fontFamily: 'Courgette' }}
				className={`${
					results ? 'pt-4 sm:pt-8' : 'pt-40'
				} text-2xl sm:text-7xl hover:cursor-pointer`}
			>
				Find my words
			</div>
			<SearchBar
				engine={filter.engineType}
				example={example}
				onResultsRetrieved={handleResultsRetrieved}
			/>
			{results && (
				<>
					<FilterBar onFilterChanged={handleFilterChanged} />
					<SearchResults
						wordType={filter.wordType}
						posType={filter.posType}
						results={results}
					/>
				</>
			)}
		</main>
	)
}

export default HomePage
