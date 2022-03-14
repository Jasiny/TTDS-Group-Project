/// <reference types="react-scripts" />

declare interface WordProps {
	word: string
	pos: string[]
	defitions: string[]
	score: string
}
declare interface GetSearchResultsResponseProps {
	words: WordProps[]
	time: string
}

declare interface FilterProps {
	engineType: EngineType
	wordType: WordType
	posType: POSType
}

declare interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

declare interface DialogTitleProps {
	id: string
	children?: React.ReactNode
	onClose: () => void
}
