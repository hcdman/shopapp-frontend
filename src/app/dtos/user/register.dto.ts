import { IsDate, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class RegisterDTO
{
    @IsString()
    fullname: string;

    @IsPhoneNumber()
    phone_number: string;

    @IsString()
    password: string;

    @IsString()
    retype_password: string;
    
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsDate()
    date_of_birth: Date
    facebook_account_id: number;
    google_account_id: number;
    role_id:number;
    constructor(data: any)
    {
        this.fullname=data.fullname;
        this.phone_number=data.phone_number;
        this.address=data.address;
        this.retype_password=data.retype_password;
        this.date_of_birth=data.date_of_birth;
        this.facebook_account_id=data.facebook_account_id||0;
        this.google_account_id=data.google_account_id||0;
        this.password=data.password;
        this.role_id = data.role_id||1;
    }
}