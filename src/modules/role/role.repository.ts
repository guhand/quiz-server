import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';

@Injectable()
export class RoleRepository {
  constructor(private readonly db: PrismaService) {}

  /**
   * @method fetchTotalRoles
   * @description Fetch the total count of roles based on given filters.
   *
   * @param {Prisma.RoleWhereInput} filters - Filtering conditions for roles.
   *
   * @returns {Promise<number>} Promise that resolves to the total count of roles.
   */
  async fetchTotalRoles(filters: Prisma.RoleWhereInput): Promise<number> {
    try {
      return await this.db.role.count({ where: filters });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchRoles
   * @description Fetch roles based on pagination and given filters.
   *
   * @param {number} page - Page number.
   * @param {number} itemsPerPage - Items per page.
   * @param {Prisma.RoleWhereInput} filters - Filtering conditions for roles.
   *
   * @returns {Promise<Role[]>} Promise that resolves to an array of roles.
   */
  async fetchRoles(
    page: number,
    itemsPerPage: number,
    filters: Prisma.RoleWhereInput,
  ): Promise<Role[]> {
    try {
      return await this.db.role.findMany({
        where: filters,
        skip: page > 1 ? (page - 1) * itemsPerPage : undefined,
        take: page > 0 ? itemsPerPage : undefined,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
