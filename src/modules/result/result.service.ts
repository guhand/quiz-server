import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResultRepository } from './result.repository';
import {
  PaginationResponse,
  dateFilterResponse,
  getErrorMessageAndStatus,
  paginationResponse,
} from 'src/common/utils/utils';
import {
  DateFilter,
  ExperienceLevel,
  PercentageFilter,
} from 'src/common/enum/enum';

@Injectable()
export class ResultsService {
  constructor(private readonly ResultsRepo: ResultRepository) {}

  /**
   * @method fetchUserTestResults
   * @description Fetches paginated user test results based on specified filters.
   *
   * @param {number} page - Page number.
   * @param {string} search - Search term for filtering records.
   * @param {number} positionId - Position ID for filtering records.
   * @param {number} subjectId - Subject ID for filtering records.
   * @param {string} percentage - Percentage filter for results.
   * @param {DateFilter} dateFilter - Date filter for results.
   * @param {string} startDate - Start date for date range filtering.
   * @param {string} endDate - End date for date range filtering.
   *
   * @returns {Promise<PaginationResponse>} Promise resolving to paginated user test results.
   */
  async fetchUserTestResults(
    page: number,
    search: string,
    positionId: number,
    subjectId: number,
    percentage: string,
    experienceLevel: number,
    dateFilter: DateFilter,
    startDate: string,
    endDate: string,
  ): Promise<PaginationResponse> {
    try {
      // Prepare date filter based on input parameters
      const filterByDate = dateFilterResponse(dateFilter, startDate, endDate);

      /**
       * Split the search query into an array of words using the space character as a delimiter.
       * So that we can able to search a fullName.
       */
      const name: string[] = search.split(' ');

      const filters: Prisma.UserTestDetailsWhereInput = {
        isStart: true,
        isFinish: true,
        updatedAt: filterByDate,
        subjectId: subjectId > 0 ? subjectId : undefined,
        user: {
          userInfo:
            positionId == 0 && experienceLevel == 0
              ? undefined
              : positionId > 0 && experienceLevel > 0
                ? {
                    some: {
                      AND: [
                        { positionId },
                        {
                          isFresher:
                            experienceLevel == ExperienceLevel.Fresher
                              ? true
                              : false,
                        },
                      ],
                    },
                  }
                : positionId > 0 && experienceLevel == 0
                  ? { some: { positionId } }
                  : experienceLevel > 0 && positionId == 0
                    ? {
                        some: {
                          isFresher:
                            experienceLevel == ExperienceLevel.Fresher
                              ? true
                              : false,
                        },
                      }
                    : undefined,
        },
        percentage:
          percentage == PercentageFilter.All
            ? { lte: 100 }
            : percentage == PercentageFilter.LessThanOrEqualTo50
              ? { lte: 50 }
              : percentage ==
                  PercentageFilter.GreaterThanOrEqualTo50AndLesserThanOrEqualTo75
                ? { gte: 50, lte: 75 }
                : percentage == PercentageFilter.GreaterThanOrEqualTo75
                  ? { gte: 75 }
                  : undefined,

        OR:
          search.length > 0
            ? [
                {
                  user: {
                    OR: [
                      {
                        AND: [
                          {
                            firstName: { contains: name[0] },
                          },
                          { lastName: { contains: name[1] } },
                        ],
                      },
                      { firstName: { contains: search } },
                      { lastName: { contains: search } },
                      { email: { contains: search } },
                      { mobile: { contains: search } },
                    ],
                  },
                },
              ]
            : undefined,
      };

      const itemsPerPage = 10;

      const [total, data] = await Promise.all([
        this.ResultsRepo.fetchTotalResults(filters),
        this.ResultsRepo.fetchUserTestResults(page, filters, itemsPerPage),
      ]);

      return paginationResponse(page, total, itemsPerPage, data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
