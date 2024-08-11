import { User } from './schema/users.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Role } from '../../common/enums/roles.enum';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    create(user: Partial<User>): Promise<void>;
    findOne(query: Partial<User>): Promise<User>;
    getProfile(id: string): Promise<User>;
    findAll(): Promise<User[]>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
    blockUser(id: string, isBlocked: boolean): Promise<void>;
    updateRole(id: string, role: Role): Promise<User>;
}
