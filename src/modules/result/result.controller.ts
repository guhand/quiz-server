import {
  Controller,
  Get,
  HttpException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResultsService } from './result.service';
import { GetResultsDto } from 'src/common/dto/result.dto';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';
import { DateFilter, PercentageFilter } from 'src/common/enum/enum';

@Controller('result')
@UseGuards(AdminGuard)
export class ResultController {
  constructor(private readonly resultsService: ResultsService) {}

  /**
   * @method fetchUserTestResults
   * @description Fetch user test results based on various filters.
   *
   * @param {GetResultsDto} query - Query parameters for filtering results.
   *
   * @returns {Promise<{ status: boolean, message: string, data: any }>} Promise that resolves to an object containing the status, message, and data.
   */
  @Get()
  async fetchUserTestResults(
    @Query()
    {
      page = 0,
      search = '',
      positionId = 0,
      subjectId = 0,
      percentage = PercentageFilter.All,
      experienceLevel = 0,
      dateFilter = DateFilter.All,
      startDate = undefined,
      endDate = undefined,
    }: GetResultsDto,
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const data = await this.resultsService.fetchUserTestResults(
        page,
        search,
        positionId,
        subjectId,
        percentage,
        experienceLevel,
        dateFilter,
        startDate,
        endDate,
      );

      return {
        status: true,
        message: 'Results fetched successfully',
        data,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
