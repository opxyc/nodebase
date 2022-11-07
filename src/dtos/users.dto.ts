import {
	IsEmail,
	IsString,
	IsEnum,
	ValidateIf,
	IsOptional,
	IsNotEmpty,
} from 'class-validator';
import { LoginType } from '~/services/auth.service';

export class CreateUserDto {
	@IsEmail()
	public email: string;

	@ValidateIf((payload) => !payload.type)
	@IsString()
	public password: string;

	@ValidateIf((payload) => !payload.type)
	@IsString()
	public name: string;

	@IsOptional()
	@IsEnum(LoginType)
	public type: string;

	@IsOptional()
	public google_id: string;
}

export class LoginDto {
	@IsEmail()
	public email: string;

	@ValidateIf((payload) => !payload.type)
	@IsString()
	@IsNotEmpty()
	public password: string;
}
