import axios from 'axios'

const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL })

interface GetSearchResultsResponseProps {
	results: string[]
}

export const getSearchResults = (
	query: string | undefined
): Promise<GetSearchResultsResponseProps> =>
	API.get('search', { params: { query } }).then(({ data }) => data)
