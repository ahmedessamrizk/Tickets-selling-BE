import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enums/roles.enum';

export class UpdateRoleDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
