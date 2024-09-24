import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { Role } from 'src/common/enum/enum';
import {
  DateFilterResponse,
  getErrorMessageAndStatus,
} from 'src/common/utils/utils';

@Injectable()
export class DashboardRepository {
  constructor(private readonly db: PrismaService) {}

  /**
   * @method fetchUserCount
   * @description Fetch the count of active users based on specified date filters.
   * @param {DateFilterResponse} dateFilter - Date filter for counting users.
   * @returns {Promise<number>} Promise that resolves to the count of active users.
   */
  async fetchUserCount(dateFilter: DateFilterResponse): Promise<number> {
    try {
      return await this.db.user.count({
        where: {
          isActive: true,
          roleId: { in: [Role.User] },
          createdAt: dateFilter,
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchPositionCount
   * @description Fetch the count of active positions based on specified date filters.
   * @param {DateFilterResponse} dateFilter - Date filter for counting positions.
   * @returns {Promise<number>} Promise that resolves to the count of active positions.
   */
  async fetchPositionCount(dateFilter: DateFilterResponse): Promise<number> {
    try {
      return await this.db.position.count({
        where: { isActive: true, createdAt: dateFilter },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchSubjectCount
   * @description Fetch the count of active subjects based on specified date filters.
   * @param {DateFilterResponse} dateFilter - Date filter for counting subjects.
   * @returns {Promise<number>} Promise that resolves to the count of active subjects.
   */
  async fetchSubjectCount(dateFilter: DateFilterResponse): Promise<number> {
    try {
      return await this.db.test.count({
        where: { isActive: true, createdAt: dateFilter },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fectchTestAssignedCount
   * @description Fetch the count of assigned tests based on specified date filters.
   * @param {DateFilterResponse} dateFilter - Date filter for counting assigned tests.
   * @returns {Promise<number>} Promise that resolves to the count of assigned tests.
   */
  async fectchTestAssignedCount(
    dateFilter: DateFilterResponse,
  ): Promise<number> {
    try {
      return await this.db.userTestDetails.count({
        where: { isActive: true, createdAt: dateFilter },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchTestCompletedCount
   * @description Fetch the count of completed tests based on specified date filters.
   * @param {DateFilterResponse} dateFilter - Date filter for counting completed tests.
   * @returns {Promise<number>} Promise that resolves to the count of completed tests.
   */
  async fetchTestCompletedCount(
    dateFilter: DateFilterResponse,
  ): Promise<number> {
    try {
      return await this.db.userTestDetails.count({
        where: { isFinish: true, updatedAt: dateFilter },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchTestInCompleteCount
   * @description Fetch the count of incomplete tests based on specified date filters.
   * @param {DateFilterResponse} dateFilter - Date filter for counting incomplete tests.
   * @returns {Promise<number>} Promise that resolves to the count of incomplete tests.
   */
  async fetchTestInCompleteCount(
    dateFilter: DateFilterResponse,
  ): Promise<number> {
    try {
      return await this.db.userTestDetails.count({
        where: {
          isStart: true,
          isFinish: false,
          updatedAt: dateFilter,
          deletedAt: null,
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method getLastFiveUserTestResults
   * @description Fetch the last five user test results based on specified date filters.
   * @param {DateFilterResponse} dateFilter - Date filter for fetching last five test results.
   * @returns {Promise<any[]>} Promise that resolves to an array of last five user test results.
   */
  async getLastFiveUserTestResults(dateFilter: DateFilterResponse) {
    try {
      return await this.db.userTestDetails.findMany({
        where: { isFinish: true, updatedAt: dateFilter },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobile: true,
              updatedAt: true,
            },
          },
          test: { select: { id: true, subject: true } },
          score: true,
          percentage: true,
        },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchUserCountWithSubjectId
   * @description Fetch various counts related to a specific subject based on specified date filters.
   * @param {number} subjectId - ID of the subject to fetch counts for.
   * @param {DateFilterResponse} dateFilter - Date filter for fetching counts with the subject.
   * @returns {Promise<Object>} Promise that resolves to an object with subject-related counts.
   */
  async fetchUserCountWithSubjectId(
    subjectId: number,
    dateFilter: DateFilterResponse,
  ): Promise<object> {
    try {
      const totalUser = await this.db.userTestDetails.count({
        where: { subjectId, deletedAt: null, updatedAt: dateFilter },
      });

      const subject = await this.db.test.findFirst({
        where: { id: subjectId, isActive: true },
        select: { subject: true },
      });

      const testCompletedUser = await this.db.userTestDetails.count({
        where: {
          subjectId,
          updatedAt: dateFilter,
          isFinish: true,
        },
      });

      const testInCompleteUser = await this.db.userTestDetails.count({
        where: {
          subjectId,
          isStart: true,
          isFinish: false,
          deletedAt: null,
          updatedAt: dateFilter,
        },
      });

      return {
        subject: subject.subject,
        totalUser,
        testCompletedUser,
        testInCompleteUser,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
