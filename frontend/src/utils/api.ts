import axios from 'axios'
import { EngineType } from '../utils/enums'

const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL })

export const getSearchResults = (
	query: string | undefined,
	engine: EngineType
): Promise<GetSearchResultsResponseProps> => {
	const sentTime = Date.now()
	return API.get('search', { params: { query, engine } }).then(({ data }) => ({
		...data,
		time: (Date.now() - sentTime) / 1000,
	}))
}

export const postFeedback = (word: string, feedback: number): Promise<PostFeedbackResponseProps> =>
	API.get('postFeedback', { params: { word, feedback } }).then(({ data }) => data)

export const clearFeedback = () => API.get('clearFeedback').then(({ data }) => data)
