import { HttpException, Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import {
  PaginationResponse,
  getErrorMessageAndStatus,
  paginationResponse,
} from 'src/common/utils/utils';
import { Prisma } from '@prisma/client';
import { Role } from 'src/common/enum/enum';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepository) {}

  /**
   * @method fetchRoles
   * @description Fetch roles based on pagination and search criteria.
   *
   * @param {number} page - Page number.
   * @param {string} search - Search criteria for roles.
   *
   * @returns {Promise<PaginationResponse>} Promise that resolves to a pagination response with roles data.
   */
  async fetchRoles(page: number, search: string): Promise<PaginationResponse> {
    try {
      const filters: Prisma.RoleWhereInput = {
        id: { notIn: [Role.SuperAdmin] },
        isActive: true,
        role: search.length > 0 ? { contains: search } : undefined,
      };

      const itemsPerPage = 10;

      const [total, data] = await Promise.all([
        this.roleRepo.fetchTotalRoles(filters),
        this.roleRepo.fetchRoles(page, itemsPerPage, filters),
      ]);

      return paginationResponse(page, total, itemsPerPage, data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
