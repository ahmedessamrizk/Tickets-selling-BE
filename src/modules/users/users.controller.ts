import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './schema/users.schema';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { Role } from '../../common/enums/roles.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { GetUsersDto } from './dtos/get-users.dto';

@UseGuards(RolesGuard)
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @Serialize(UserDto)
  getProfile(@CurrentUser() user: User): Promise<User> {
    return this.usersService.getProfile(user._id);
  }

  @Get('/logout')
  logout(@Res() res: Response): Response {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.json({ message: 'Logged out successfully' });
  }

  @Get()
  @Roles(Role.SuperAdmin)
  getUsers(@Query() query: GetUsersDto): Promise<any> {
    return this.usersService.findAll(query);
  }

  @Patch('/profile')
  @Serialize(UserDto)
  updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateProfile(user._id, updateUserDto);
  }

  @Patch('/:id/block')
  @Roles(Role.SuperAdmin)
  blockUser(@Param('id') id: string): Promise<void> {
    return this.usersService.blockUser(id, true);
  }

  @Patch('/:id/unblock')
  @Roles(Role.SuperAdmin)
  unblockUser(@Param('id') id: string): Promise<void> {
    return this.usersService.blockUser(id, false);
  }

  @Patch('/:id/role')
  @Roles(Role.SuperAdmin)
  @Serialize(GetUsersDto)
  changeRole(
    @Param('id') id: string,
    @Body() role: UpdateRoleDto,
  ): Promise<User> {
    return this.usersService.updateRole(id, role.role);
  }
}
