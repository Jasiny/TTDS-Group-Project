import axios from 'axios'

const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL })

export const getSearchResults = (
	query: string | undefined
): Promise<GetSearchResultsResponseProps> =>
	API.get('search', { params: { query, sentTime: Date.now() } }).then(({ data }) => data)
