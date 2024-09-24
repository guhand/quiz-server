import { HttpException, Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import {
  dateFilterResponse,
  getErrorMessageAndStatus,
} from 'src/common/utils/utils';
import { DateFilter, Subject } from 'src/common/enum/enum';

@Injectable()
/**
 * @class DashboardService
 * @description Service responsible for handling business logic related to the dashboard.
 */
export class DashboardService {
  constructor(private readonly dashboardRepo: DashboardRepository) {}

  /**
   * @method fetchDashboardCounts
   * @description Fetch counts and data for the dashboard based on specified filters.
   * @param {DateFilter} dateFilter - Filter to specify the date range for dashboard counts.
   * @param {string} startDate - Start date for the date range filter.
   * @param {string} endDate - End date for the date range filter.
   * @returns {Promise<Object>} Promise that resolves to an object with dashboard counts and data.
   */
  async fetchDashboardCounts(
    dateFilter: DateFilter,
    startDate: string,
    endDate: string,
  ): Promise<object> {
    // Generate date filter based on the specified parameters
    const filterByDate = dateFilterResponse(dateFilter, startDate, endDate);

    try {
      // Fetch counts and data concurrently using repository methods
      const [
        totalUsers,
        totalTestAssignedUsers,
        totalTestCompletedUsers,
        totalTestInCompleteUsers,
        totalSubjects,
        javascript,
        embedded,
        lastestResults,
      ] = await Promise.all([
        this.dashboardRepo.fetchUserCount(filterByDate),
        this.dashboardRepo.fectchTestAssignedCount(filterByDate),
        this.dashboardRepo.fetchTestCompletedCount(filterByDate),
        this.dashboardRepo.fetchTestInCompleteCount(filterByDate),
        this.dashboardRepo.fetchSubjectCount(filterByDate),
        this.dashboardRepo.fetchUserCountWithSubjectId(
          Subject.JavaScript,
          filterByDate,
        ),
        this.dashboardRepo.fetchUserCountWithSubjectId(
          Subject.Embedded,
          filterByDate,
        ),
        this.dashboardRepo.getLastFiveUserTestResults(filterByDate),
      ]);

      // Aggregate subject data
      const subjectData = [javascript, embedded];

      return {
        totalUsers,
        totalTestAssignedUsers,
        totalTestCompletedUsers,
        totalTestInCompleteUsers,
        totalSubjects,
        subjectData,
        lastestResults,
      };
    } catch (error) {
      // Handle and throw HTTP exception for error cases
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
