import {
  Controller,
  Get,
  HttpException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { CommonGetApiDto } from 'src/common/dto/commonGetApi.dto';

@Controller('role')
@UseGuards(AdminGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * @method fetchRoles
   * @description Fetch the Roles data.
   *
   * @param {CommonGetApiDto} params - Query parameters for pagination and search.
   * @param {number} params.page - Page number.
   * @param {string} params.search - Filtering records based on the search.
   *
   * @returns {Promise<object>} Promise that resolves to an object containing roles data.
   */
  @Get()
  async fetchRoles(
    @Query() { page = 0, search = '' }: CommonGetApiDto,
  ): Promise<object> {
    try {
      const data = await this.roleService.fetchRoles(page, search);

      return {
        status: true,
        message: 'Roles fetched successfully',
        data,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
