import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Role } from '../../common/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: Partial<User>): Promise<void> {
    await this.userModel.create(user);
  }

  async findOne(query: Partial<User>): Promise<User> {
    return this.userModel.findOne(query);
  }

  async getProfile(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    //check phone isn't already taken
    const user = await this.findOne({ phoneNumber: updateUserDto.phoneNumber });

    if (user) {
      throw new BadRequestException('Phone number already taken');
    }

    return this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });
  }

  async blockUser(id: string, isBlocked: boolean): Promise<void> {
    const user = await this.getProfile(id);
    if (!user) {
      throw new BadRequestException('user not found');
    }

    //prevent blocking super admin
    if (user.role === Role.SuperAdmin) {
      throw new BadRequestException('you cannot block a super admin');
    }

    await this.userModel.findByIdAndUpdate(id, { isBlocked });
  }

  async updateRole(id: string, role: Role): Promise<User> {
    const user = await this.getProfile(id);
    if (!user) {
      throw new BadRequestException('user not found');
    }

    if (user.role === Role.SuperAdmin || role === Role.SuperAdmin) {
      throw new BadRequestException('you cannot change role of super admin');
    }

    return await this.userModel.findByIdAndUpdate(id, { role }, { new: true });
  }
}
