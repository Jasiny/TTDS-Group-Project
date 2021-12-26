import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'

const queryClient = new QueryClient({
	defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

const App = () => (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="*" element={<Navigate replace to="/" />} />
			</Routes>
		</BrowserRouter>
	</QueryClientProvider>
)

export default App
