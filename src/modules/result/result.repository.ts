import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';

@Injectable()
export class ResultRepository {
  constructor(private readonly db: PrismaService) {}

  /**
   * @method fetchTotalResults
   * @description Fetches the total count of user test results based on specified filters.
   *
   * @param {Prisma.UserTestDetailsWhereInput} filters - Filtering criteria for counting results.
   *
   * @returns {Promise<number>} Promise resolving to the total count of user test results.
   */
  async fetchTotalResults(
    filters: Prisma.UserTestDetailsWhereInput,
  ): Promise<number> {
    try {
      return await this.db.userTestDetails.count({ where: filters });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchUserTestResults
   * @description Fetches paginated user test results based on specified filters.
   *
   * @param {number} page - Page number.
   * @param {Prisma.UserTestDetailsWhereInput} filters - Filtering criteria for fetching results.
   * @param {number} itemsPerPage - Number of items per page.
   *
   * @returns {Promise<any[]>} Promise resolving to paginated user test results.
   */
  async fetchUserTestResults(
    page: number,
    filters: Prisma.UserTestDetailsWhereInput,
    itemsPerPage: number,
  ): Promise<any[]> {
    try {
      return await this.db.userTestDetails.findMany({
        where: filters,
        skip: page > 1 ? (page - 1) * itemsPerPage : undefined,
        take: page > 0 ? itemsPerPage : undefined,
        include: {
          test: { select: { id: true, subject: true } },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobile: true,
              role: { select: { id: true, role: true } },
              userInfo: {
                where: { isActive: true },
                select: {
                  college: true,
                  degree: true,
                  dob: true,
                  specialization: true,
                  isFresher: true,
                  yearsOfExperience: true,
                  position: { select: { id: true, position: true } },
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
