import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByGithubId(githubId: number): Promise<User>;
    update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User>;
    updateByGithubId(githubId: number, updateUserDto: Partial<CreateUserDto>): Promise<User>;
    remove(id: string): Promise<User>;
}
