import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/database';

export interface UserAttributes {
	id: number;
	email: string;
	password: string;
	name: string;
	google_id: string;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date;
}

export interface UserInput
	extends Optional<UserAttributes, 'id' | 'google_id' | 'password'> {}
export interface UserOutput extends Required<UserAttributes> {}

export class User
	extends Model<UserAttributes, UserInput>
	implements UserAttributes
{
	public id!: number;
	public email!: string;
	public password: string;
	public name: string;
	public google_id: string;

	// timestamps!
	public readonly created_at!: Date;
	public readonly updated_at!: Date;
	public readonly deleted_at!: Date;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		google_id: {
			type: DataTypes.STRING,
			unique: true,
		},
	},
	{
		timestamps: true,
		sequelize: sequelizeConnection,
		paranoid: true,
		underscored: true,
	}
);
