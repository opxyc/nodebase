export interface DataStoredInToken {
	id: number;
	email: string;
	google_id: string;
	createdAt?: Date;
}

export interface TokenData {
	token: string;
	expiresIn: number;
}
