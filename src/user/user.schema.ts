import { BaseEntity } from '@src/lib/base.entity';
import { Schema } from 'dynamoose';

export const UserSchema = new Schema({
	pk: {
		type: String,
		hashKey: true
	},
	sk: {
		type: String,
		rangeKey: true
	},
	email: { type: String, required: true },
	name: { type: String, required: true },
	picture: { type: String },
	isDel: { type: Boolean, default: false }
});

export interface UserKey extends BaseEntity {
	pk: string;
	sk: string;
}

export interface User extends BaseEntity {
	pk: string;
	sk: string;
	email: string;
	name: string;
	picture: string | null;
	isDel: boolean;
	createdAt: string;
	updatedAt: string;
}
