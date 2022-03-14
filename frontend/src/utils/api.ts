import axios from 'axios'
import { EngineType } from '../utils/enums'

const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL })

export const getSearchResults = (
	query: string | undefined,
	engine: EngineType
): Promise<GetSearchResultsResponseProps> =>
	API.get('search', { params: { query, engine, sentTime: Date.now() } }).then(({ data }) => data)

export const postFeedback = (word: string, feedback: number): Promise<PostFeedbackResponseProps> =>
	API.get('feedback', { params: { word, feedback } }).then(({ data }) => data)
