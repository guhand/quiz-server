import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  GetUsersDto,
  UpdateUserDto,
  UploadBulkUsersDto,
} from 'src/common/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';
import { CurrentUser } from 'src/common/decorators/decorators';
import { DateFilter } from 'src/common/enum/enum';

@Controller('user')
@UseGuards(AdminGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   *
   * @method createUser
   * @description Create a new user.
   * @param {any} user - Current user information obtained from the CurrentUser decorator.
   * @param {CreateUserDto} createUserDto - DTO containing user creation information.
   * @returns {Promise<object>} Object indicating the success status and a message.
   */
  @Post()
  async createUser(
    @CurrentUser() user: any,
    @Body() createUserDto: CreateUserDto,
  ): Promise<object> {
    try {
      await this.userService.createUser(+user?.roleId, createUserDto);

      return {
        status: true,
        message: `${
          createUserDto.roleId == 2
            ? 'Admin'
            : createUserDto.roleId == 3
              ? 'User'
              : ''
        } created successfully`,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   *
   * @method updateUser
   * @description Update user details.
   * @param {any} user - Current user information obtained from the CurrentUser decorator.
   * @param {UpdateUserDto} updateUserDto - DTO containing user update information.
   * @returns {Promise<object>} Object indicating the success status and a message.
   */
  @Patch()
  async updateUser(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<object> {
    try {
      await this.userService.updateUser(+user?.roleId, updateUserDto);

      return {
        status: true,
        message: 'User details updated successfully',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   *
   * @method fetchUsers
   * @description Fetch a list of users based on provided query parameters.
   * @param {GetUsersDto} query - DTO containing query parameters for fetching users.
   * @returns {Promise<object>} Object indicating the success status, a message, and the fetched data.
   */
  @Get()
  async fetchUsers(
    @Query()
    {
      page = 0,
      search = '',
      roleId = 0,
      positionId = 0,
      subjectId = 0,
      experienceLevel = 0,
      dateFilter = DateFilter.All,
      startDate = undefined,
      endDate = undefined,
    }: GetUsersDto,
  ): Promise<object> {
    try {
      const data = await this.userService.fetchUsers(
        page,
        search,
        roleId,
        positionId,
        subjectId,
        experienceLevel,
        dateFilter,
        startDate,
        endDate,
      );

      return { status: true, message: 'Users fetched successfully', data };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   *
   * @method uploadBulkUsers
   * @description Upload a file containing user data in bulk.
   * @param {Express.Multer.File} file - Uploaded file containing user data.
   * @param {UploadBulkUsersDto} uploadBulkUsersDto - DTO containing additional information for bulk user upload.
   * @returns {Promise<object>} Object indicating the success status and a message.
   */
  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBulkUsers(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadBulkUsersDto: UploadBulkUsersDto,
  ): Promise<object> {
    try {
      await this.userService.uploadBulkUsers(file, uploadBulkUsersDto);

      return {
        status: true,
        message: 'Users created successfully',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
