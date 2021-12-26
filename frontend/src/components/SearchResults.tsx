import React from 'react'

interface SearchResultsProps {
	results: string[]
}

const SearchResults = ({ results }: SearchResultsProps) => (
	<section className="grid grid-cols-3 sm:grid-flow-col sm:grid-rows-25 md:grid-rows-20">
		{results.map((result, idex) => (
			<div key={idex} className="px-2 text-lg text-right sm:px-8 lg:px-12">
				<span className="text-gray-500 tabular-nums">{`${idex + 1}. `}</span>
				<span>{result}</span>
			</div>
		))}
	</section>
)

export default SearchResults
