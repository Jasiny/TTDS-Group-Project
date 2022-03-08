/// <reference types="react-scripts" />

declare interface GetSearchResultsResponseProps {
	words: Array<{ word: string; score: string }>
	time: string
}
