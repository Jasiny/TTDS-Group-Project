/// <reference types="react-scripts" />

declare interface GetSearchResultsResponseProps {
	words: Array<{ word: string; defi: string[]; score: string }>
	time: string
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
