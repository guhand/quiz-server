import {
  Controller,
  Get,
  HttpException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';
import { DashboardDto } from 'src/common/dto/dashboard.dto';
import { DateFilter } from 'src/common/enum/enum';

@Controller('dashboard')
@UseGuards(AdminGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * @method fetchDashboardCounts
   * @description Fetch counts for the dashboard based on specified filters.
   * @param {DashboardDto} query - Query parameters for dashboard counts.
   * @returns {Object} Response object with dashboard counts data and success status.
   */
  @Get()
  async fetchDashboardCounts(
    @Query()
    {
      dateFilter = DateFilter.All,
      startDate = undefined,
      endDate = undefined,
    }: DashboardDto,
  ): Promise<object> {
    try {
      const data = await this.dashboardService.fetchDashboardCounts(
        dateFilter,
        startDate,
        endDate,
      );

      return {
        status: true,
        message: 'Dashboard counts fetched successfully',
        data,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
