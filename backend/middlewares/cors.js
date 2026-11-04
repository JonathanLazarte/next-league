import cors from 'cors'

const ACCEPTED_ORIGINS = [
			'https://next-league-client.vercel.app',
			'https://next-league.vercel.app',
			'http://localhost:3000',
			'http://localhost:3001',
			]
const ACCEPTED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({
	origin:(origin, callback) => {
		
	
	if(ACCEPTED_ORIGINS.includes(origin)){
		return callback(null, true)
	}
	if(!origin){
		return callback(null, true)
	}
	if(origin == null){
		return callback(null, true)
	}

	return callback(new Error('Not allowed by CORS'))
	},
	methods: ACCEPTED_METHODS,
})
