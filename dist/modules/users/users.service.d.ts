import { User } from './schema/users.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Role } from '../../common/enums/roles.enum';
import { PaginationService } from '../../common/services/pagination.service';
import { GetUsersDto } from './dtos/get-users.dto';
export declare class UsersService {
    private userModel;
    private readonly paginationService;
    constructor(userModel: Model<User>, paginationService: PaginationService);
    create(user: Partial<User>): Promise<void>;
    findOne(query: Partial<User>): Promise<User>;
    getProfile(id: string): Promise<User>;
    findAll(query: GetUsersDto): Promise<{
        total: number;
        totalPages: number;
        users: User[];
    }>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
    blockUser(id: string, isBlocked: boolean): Promise<void>;
    updateRole(id: string, role: Role): Promise<User>;
}
