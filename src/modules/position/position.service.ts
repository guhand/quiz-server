import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePositionDto,
  UpdatePositionDto,
} from 'src/common/dto/position.dto';
import { PositionRepository } from './position.repository';
import { Prisma } from '@prisma/client';
import {
  PaginationResponse,
  getErrorMessageAndStatus,
  paginationResponse,
} from 'src/common/utils/utils';

@Injectable()
export class PositionService {
  constructor(private readonly positionRepo: PositionRepository) {}

  /**
   * @method createPosition
   * @description Create a new position.
   * @param {CreatePositionDto} data - Data for creating a position.
   */
  async createPosition(data: CreatePositionDto) {
    try {
      await this.positionRepo.createPosition(data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchPositions
   * @description Fetch positions data based on pagination and search parameters.
   * @param {number} page - Page number for pagination.
   * @param {string} search - Search query for filtering positions.
   * @returns {Promise<PaginationResponse>} Response object with paginated positions data.
   */
  async fetchPositions(
    page: number,
    search: string,
  ): Promise<PaginationResponse> {
    try {
      const filters: Prisma.PositionWhereInput = {
        isActive: true,
        position: search.length > 0 ? { contains: search } : undefined,
      };

      const itemsPerPage = 10;

      const [total, data] = await Promise.all([
        this.positionRepo.fetchTotalPositions(filters),
        this.positionRepo.fetchPositions(page, itemsPerPage, filters),
      ]);

      return paginationResponse(page, total, itemsPerPage, data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updatePosition
   * @description Update existing position data.
   * @param {UpdatePositionDto} updatePositionDto - Data for updating a position.
   */
  async updatePosition({ positionId, position }: UpdatePositionDto) {
    try {
      if (!(await this.positionRepo.findPositionById(positionId)))
        throw new NotFoundException('Position not found');

      await this.positionRepo.updatePosition(positionId, position);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
