import { User } from './schema/users.schema';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: User): Promise<User>;
    logout(res: Response): Response;
    getUsers(): Promise<User[]>;
    updateProfile(user: User, updateUserDto: UpdateUserDto): Promise<User>;
    blockUser(id: string): Promise<void>;
    unblockUser(id: string): Promise<void>;
    changeRole(id: string, role: UpdateRoleDto): Promise<User>;
}
