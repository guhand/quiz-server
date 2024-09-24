import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PositionService } from './position.service';
import {
  CreatePositionDto,
  GetPositionsDto,
  UpdatePositionDto,
} from 'src/common/dto/position.dto';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';

@Controller('position')
@UseGuards(AdminGuard)
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  /**
   * @method createPosition
   * @description Create a new position.
   * @param {CreatePositionDto} createPositionDto - Data for creating a position.
   * @returns {Object} Response object indicating the success status and message.
   */
  @Post()
  async createPosition(
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<object> {
    try {
      await this.positionService.createPosition(createPositionDto);
      return {
        status: true,
        message: 'Position created successfully',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchPositions
   * @description Fetch positions data based on query parameters.
   * @param {GetPositionsDto} query - Query parameters for pagination and search.
   * @returns {Object} Response object with positions data and success status.
   */
  @Get()
  async fetchPositions(
    @Query() { page = 0, search = '' }: GetPositionsDto,
  ): Promise<object> {
    try {
      const data = await this.positionService.fetchPositions(page, search);
      return {
        status: true,
        message: 'Positions fetched successfully',
        data,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updatePosition
   * @description Update existing position data.
   * @param {UpdatePositionDto} updatePositionDto - Data for updating a position.
   * @returns {Object} Response object indicating the success status and message.
   */
  @Patch()
  async updatePosition(
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<object> {
    try {
      await this.positionService.updatePosition(updatePositionDto);
      return {
        status: true,
        message: 'Position updated successfully',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
