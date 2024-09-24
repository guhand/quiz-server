import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, User, UserTestDetails } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import {
  AssignTestDto,
  CreateSubjectDto,
  UpdateSubjectDto,
} from 'src/common/dto/test.dto';
import { Role } from 'src/common/enum/enum';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';
import { Test } from '@prisma/client';

@Injectable()
export class TestRepository {
  constructor(private readonly db: PrismaService) {}

  /**
   * @method createSubject
   * @description Creates a new subject in the database.
   * @param {CreateSubjectDto} createSubjectDto - Data for creating a subject.
   */
  async createSubject({ subject }: CreateSubjectDto) {
    try {
      await this.db.test.create({ data: { subject } });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchSubjectsCount
   * @description Counts the number of subjects based on specified filters.
   * @param {Prisma.TestWhereInput} filters - Filters to apply when counting subjects.
   * @returns {Promise<number>} Promise that resolves to the count of subjects.
   */
  async fetchSubjectsCount(filters: Prisma.TestWhereInput): Promise<number> {
    try {
      return await this.db.test.count({ where: filters });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchSubjects
   * @description Fetches subjects data with optional pagination and filtering.
   * @param {number} page - Page number.
   * @param {number} itemsPerpage - Items per page to display records.
   * @param {Prisma.TestWhereInput} filters - Filters to apply when fetching subjects.
   * @returns {Promise<Test[]>} Promise that resolves to an array of subjects.
   */
  async fetchSubjects(
    page: number,
    itemsPerpage: number,
    filters: Prisma.TestWhereInput,
  ): Promise<Test[]> {
    try {
      return await this.db.test.findMany({
        where: filters,
        skip: page > 1 ? (page - 1) * itemsPerpage : undefined,
        take: page > 0 ? itemsPerpage : undefined,
        include: {
          questions: {
            where: { isActive: true },
            select: {
              id: true,
              question: true,
              options: {
                where: { isActive: true },
                select: { id: true, option: true },
              },
            },
          },
        },
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
   * @method updateSubject
   * @description Updates the subject information based on the provided ID.
   * @param {UpdateSubjectDto} data - Data containing the subject ID and updated subject information.
   */
  async updateSubject({ subjectId, subject }: UpdateSubjectDto) {
    try {
      await this.db.test.update({
        where: { id: subjectId },
        data: { subject },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method findTestById
   * @description Finds a test by its ID.
   * @param {number} id - The ID of the test to find.
   * @returns  Promise that resolves to the found test or null if not found.
   */
  async findTestById(id: number) {
    try {
      return await this.db.test.findFirst({
        where: {
          id,
          isActive: true,
        },
        include: {
          questions: {
            where: { isActive: true },
            select: {
              id: true,
              options: {
                where: { isActive: true },
                select: { id: true, isCorrect: true },
              },
            },
          },
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method findUserById
   * @description Finds a user by ID and subject ID.
   * @param {number} id - The ID of the user to find.
   * @param {number} subjectId - The ID of the subject associated with the user.
   * @returns {Promise<User | null>} Promise that resolves to the found user or null if not found.
   */
  async findUserById(id: number, subjectId: number): Promise<User | null> {
    try {
      return await this.db.user.findFirst({
        where: {
          id,
          isActive: true,
          roleId: Role.User,
        },
        include: { userTestDetails: { where: { isActive: true, subjectId } } },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method findTestStatus
   * @description Finds the test status for a user.
   * @param {number} userId - The ID of the user for whom to find the test status.
   * @returns {Promise<UserTestDetails | null>} Promise that resolves to the found test status or null if not found.
   */
  async findTestStatus(userId: number): Promise<UserTestDetails | null> {
    try {
      return await this.db.userTestDetails.findFirst({
        where: { userId, isFinish: false, isActive: true },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method findIfUserSubmittedTestAlready
   * @description Checks if a user has already submitted a test for a specific subject.
   * @param {number} userId - The ID of the user to check.
   * @param {number} subjectId - The ID of the subject for which to check test submission.
   * @returns {Promise<UserTestDetails | null>} Promise that resolves to the found submission details or null if not found.
   */
  async findIfUserSubmittedTestAlready(
    userId: number,
    subjectId: number,
  ): Promise<UserTestDetails | null> {
    try {
      return await this.db.userTestDetails.findFirst({
        where: {
          userId,
          subjectId,
          isFinish: true,
          isActive: false,
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method isTestAssignedAlready
   * @description Checks if a test has already been assigned to a user for a specific subject.
   * @param {number} userId - The ID of the user to check.
   * @param {number} subjectId - The ID of the subject for which to check test assignment.
   * @returns {Promise<boolean>} Promise that resolves to true if the test is assigned, false otherwise.
   */
  async isTestAssignedAlready(
    userId: number,
    subjectId: number,
  ): Promise<boolean> {
    try {
      return (
        (await this.db.userTestDetails.count({
          where: { userId, subjectId },
        })) > 0
      );
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method assignTest
   * @description Assigns a test subject to a user.
   * @param {AssignTestDto} data - Data containing the subject ID and user ID for test assignment.
   */
  async assignTest({ subjectId, userId }: AssignTestDto) {
    try {
      await this.db.userTestDetails.create({
        data: { userId, subjectId },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updateMarks
   * @description Updates the test marks and status for a user.
   * @param {number} userId - The ID of the user for whom to update the marks.
   * @param {number} subjectId - The ID of the subject for which to update the marks.
   * @param {string} score - The score achieved by the user.
   * @param {number} percentage - The percentage of the score achieved.
   */
  async updateMarks(
    userId: number,
    subjectId: number,
    score: string,
    percentage: number,
  ) {
    try {
      await this.db.userTestDetails.updateMany({
        where: { userId, subjectId, isActive: true },
        data: { score, percentage, isFinish: true, isActive: false },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method isTestStarted
   * @description Checks if a user has started a test for a specific subject.
   * @param {number} userId - The ID of the user to check.
   * @param {number} subjectId - The ID of the subject for which to check test start status.
   * @returns {Promise<UserTestDetails | null>} Promise that resolves to the found test details if started, null otherwise.
   */
  async isTestStarted(
    userId: number,
    subjectId: number,
  ): Promise<UserTestDetails | null> {
    try {
      return await this.db.userTestDetails.findFirst({
        where: { userId, subjectId, isStart: true, isActive: true },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method findIfUserCompletedTestAlready
   * @description Checks if a user has already completed a test for a specific subject.
   * @param {number} userId - The ID of the user to check.
   * @param {number} subjectId - The ID of the subject for which to check test completion status.
   * @returns {Promise<UserTestDetails | null>} Promise that resolves to the found test details if completed, null otherwise.
   */
  async findIfUserCompletedTestAlready(
    userId: number,
    subjectId: number,
  ): Promise<UserTestDetails | null> {
    try {
      return await this.db.userTestDetails.findFirst({
        where: { userId, subjectId, isFinish: true },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method findQuestionWithCorrectOption
   * @description Finds a question with its correct option based on the provided ID.
   * @param {number} id - The ID of the question to retrieve.
   * @returns {Promise<Question | null>} Promise that resolves to the found question with its correct option, or null if not found.
   */
  async findQuestionWithCorrectOption(id: number) {
    try {
      return await this.db.question.findFirst({
        where: {
          id,
          isActive: true,
        },
        include: {
          options: {
            where: { isCorrect: true, isActive: true },
            select: { id: true, isCorrect: true },
          },
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method reassignTest
   * @description Reassigns a test for a user and updates reassignment count.
   * @param {number} userId - The ID of the user for whom to reassign the test.
   * @param {number} subjectId - The ID of the subject for which to reassign the test.
   */
  async reassignTest(userId: number, subjectId: number): Promise<void> {
    try {
      await this.db.$transaction(async (tx) => {
        // Deactivate existing test details for the user and subject
        await tx.userTestDetails.updateMany({
          where: { userId, subjectId },
          data: { isActive: false, deletedAt: new Date() },
        });

        // Retrieve the reassignment count and create new test details with incremented reassign count
        const reassignCount = await this.findReassignCount(userId, subjectId);
        await tx.userTestDetails.create({
          data: { userId, subjectId, reassignCount },
        });
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchReassignedTestCount
   * @description Retrieves the count of reassigned tests based on specified filters.
   * @param {Prisma.UserTestDetailsWhereInput} filters - Filters to apply when counting reassigned tests.
   * @returns {Promise<number>} Promise that resolves to the count of reassigned tests.
   */
  async fetchReassignedTestCount(
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
   * @method findReassignCount
   * @description Retrieves the count of reassignments for a user and subject where the test is not finished.
   * @param {number} userId - The ID of the user for whom to find the reassignment count.
   * @param {number} subjectId - The ID of the subject for which to find the reassignment count.
   * @returns {Promise<number>} Promise that resolves to the reassignment count.
   */
  async findReassignCount(userId: number, subjectId: number): Promise<number> {
    try {
      return await this.db.userTestDetails.count({
        where: { userId, subjectId, isFinish: false },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchReassignTests
   * @description Retrieves reassigned test details based on specified filters and pagination parameters.
   * @param {number} page - Page number for pagination.
   * @param {number} itemsPerPage - Number of items per page to display.
   * @param {Prisma.UserTestDetailsWhereInput} filters - Filters to apply when fetching reassigned tests.
   * @returns {Promise<UserTestDetails[]>} Promise that resolves to reassigned test details.
   */
  async fetchReassignTests(
    page: number,
    itemsPerPage: number,
    filters: Prisma.UserTestDetailsWhereInput,
  ): Promise<UserTestDetails[]> {
    try {
      return await this.db.userTestDetails.findMany({
        where: filters,
        skip: page > 1 ? (page - 1) * itemsPerPage : undefined,
        take: page > 0 ? itemsPerPage : undefined,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobile: true,
              userInfo: {
                where: { isActive: true },
                select: { position: { select: { id: true, position: true } } },
              },
              userTestDetails: {
                where: { isActive: true },
                select: { test: { select: { id: true, subject: true } } },
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

  /**
   * @method findUserWithSubject
   * @description Find user details with a specific subject.
   *
   * @param {number} userId - User ID.
   * @param {number} subjectId - Subject ID.
   * @returns {Promise<UserTestDetails>} Promise that resolves to user details with the specified subject.
   */
  async findUserWithSubject(
    userId: number,
    subjectId: number,
  ): Promise<UserTestDetails> {
    try {
      return await this.db.userTestDetails.findFirst({
        where: { userId, subjectId, isActive: true },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method findSubjectByUserId
   * @description Retrieves the subject details associated with a user based on user ID.
   * @param {number} userId - The ID of the user for whom to find the subject details.
   * @returns {Promise<UserTestDetails | null>} Promise that resolves to the subject details or null if not found.
   */
  async findSubjectByUserId(userId: number): Promise<UserTestDetails | null> {
    try {
      return await this.db.userTestDetails.findFirst({
        where: { userId, isActive: true },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchQuestions
   * @description Retrieves active questions for a specified subject based on subject ID.
   * @param {number} subjectId - The ID of the subject for which to fetch questions.
   * @returns {Promise<Question[]>} Promise that resolves to an array of active questions for the specified subject.
   */
  async fetchQuestions(subjectId: number) {
    try {
      return await this.db.question.findMany({
        where: { isActive: true, subjectId },
        select: {
          id: true,
          question: true,
          options: {
            where: { isActive: true },
            select: { id: true, option: true },
          },
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
