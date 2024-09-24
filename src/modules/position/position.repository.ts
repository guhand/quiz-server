import { HttpException, Injectable } from '@nestjs/common';
import { Position, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { CreatePositionDto } from 'src/common/dto/position.dto';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';

@Injectable()
export class PositionRepository {
  constructor(private readonly db: PrismaService) {}

  /**
   * @method createPosition
   * @description Create a new position in the database.
   * @param {CreatePositionDto} position - Data for creating a position.
   */
  async createPosition({ position }: CreatePositionDto) {
    try {
      await this.db.position.create({ data: { position } });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method findPositionById
   * @description Find a position by ID in the database.
   * @param {number} id - ID of the position to find.
   * @returns {Promise<Position>} Promise that resolves to the found position or null.
   */
  async findPositionById(id: number): Promise<Position> {
    try {
      return await this.db.position.findFirst({
        where: { id, isActive: true },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchTotalPositions
   * @description Fetch the total count of positions based on specified filters.
   * @param {Prisma.PositionWhereInput} filters - Filters to apply when counting positions.
   * @returns {Promise<number>} Promise that resolves to the total count of positions.
   */
  async fetchTotalPositions(
    filters: Prisma.PositionWhereInput,
  ): Promise<number> {
    try {
      // Use Prisma to count the total number of positions based on filters
      return await this.db.position.count({ where: filters });
    } catch (error) {
      // Handle and throw HTTP exception for error cases
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchPositions
   * @description Fetch positions based on pagination, items per page, and filters.
   * @param {number} page - Page number for pagination.
   * @param {number} itemsPerPage - Number of items per page.
   * @param {Prisma.PositionWhereInput} filters - Filters to apply when fetching positions.
   * @returns {Promise<Position[]>} Promise that resolves to an array of positions.
   */
  async fetchPositions(
    page: number,
    itemsPerPage: number,
    filters: Prisma.PositionWhereInput,
  ): Promise<Position[]> {
    try {
      return await this.db.position.findMany({
        where: filters,
        skip: page > 1 ? (page - 1) * itemsPerPage : undefined,
        take: page > 0 ? itemsPerPage : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updatePosition
   * @description Update an existing position in the database.
   * @param {number} id - ID of the position to update.
   * @param {string} position - New position data.
   */
  async updatePosition(id: number, position: string) {
    try {
      await this.db.position.update({ where: { id }, data: { position } });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
