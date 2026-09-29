import axios from "axios"
import { DASHBOARD_USER_ID } from './auth'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		Authorization: `Bearer ${DASHBOARD_USER_ID}`,
	},
})
