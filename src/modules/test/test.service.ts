import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TestRepository } from './test.repository';
import {
  AssignTestDto,
  CreateSubjectDto,
  SubmitTestDto,
  ReassignTestDto,
  UpdateSubjectDto,
} from 'src/common/dto/test.dto';
import {
  PaginationResponse,
  dateFilterResponse,
  getErrorMessageAndStatus,
  paginationResponse,
} from 'src/common/utils/utils';
import { Prisma, Question } from '@prisma/client';
import { DateFilter } from 'src/common/enum/enum';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TestService {
  constructor(
    private readonly testRepo: TestRepository,
    private readonly authService: AuthService,
  ) {}

  /**
   * @method createSubject
   * @description Create a new test subject.
   *
   * @param {CreateSubjectDto} data - Data to create a test subject.
   */
  async createSubject(data: CreateSubjectDto) {
    try {
      await this.testRepo.createSubject(data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchSubjects
   * @description Fetch a paginated list of test subjects based on provided parameters.
   *
   * @param {number} page - Page number for pagination.
   * @param {string} search - Search string to filter subjects by name.
   * @returns {Promise<PaginationResponse>} Promise that resolves to a PaginationResponse.
   */
  async fetchSubjects(
    page: number,
    search: string,
  ): Promise<PaginationResponse> {
    try {
      const filters: Prisma.TestWhereInput = {
        isActive: true,
        subject: search.length > 0 ? { contains: search } : undefined,
      };

      const itemsPerPage = 10;

      const [subjectsCount, data] = await Promise.all([
        this.testRepo.fetchSubjectsCount(filters),
        this.testRepo.fetchSubjects(page, itemsPerPage, filters),
      ]);

      return paginationResponse(page, subjectsCount, itemsPerPage, data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updateSubject
   * @description Update a test subject.
   *
   * @param {UpdateSubjectDto} data - Data to update a test subject.
   */
  async updateSubject(data: UpdateSubjectDto) {
    try {
      await this.testRepo.updateSubject(data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method assignTest
   * @description Assign a test subject to the user.
   *
   * @param {AssignTestDto} data - Data to assign a subject to the user.
   */
  async assignTest(data: AssignTestDto) {
    try {
      const findTest = await this.testRepo.findTestById(data.subjectId);

      if (!findTest) throw new NotFoundException('Test not found');

      const findUser = await this.testRepo.findUserById(
        data.userId,
        findTest.id,
      );

      if (!findUser) throw new NotFoundException('User not found');

      const findTestStatus = await this.testRepo.findTestStatus(findUser.id);
      if (
        findTestStatus != null &&
        (findTestStatus?.isStart == true || findTestStatus?.isStart == null)
      )
        throw new BadRequestException(
          'The user has not yet completed the assigned test.',
        );

      if (
        await this.testRepo.isTestAssignedAlready(data.userId, data.subjectId)
      )
        throw new BadRequestException(
          'The subject has already been assigned to  the user.',
        );

      await this.testRepo.assignTest(data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method startTest
   * @description Start a test for a specified user.
   *
   * @param {number} userId - ID of the user starting the test.
   * @returns {Promise<{ subjectId: number, questionsWithOptions: Question[] }>} Promise that resolves to test details.
   */
  async startTest(
    userId: number,
  ): Promise<{ subjectId: number; questionsWithOptions: Question[] }> {
    try {
      const findSubjectId = await this.testRepo.findSubjectByUserId(userId);

      if (!findSubjectId) throw new BadRequestException('User not found');

      const questions = await this.testRepo.fetchQuestions(
        findSubjectId.subjectId,
      );

      // Randomize the order of questions
      const randomizedQuestions = this.shuffleArray(questions);

      // Shuffle the options for each question
      randomizedQuestions.forEach((question) => {
        question.options = this.shuffleArray(question.options);
      });

      return {
        subjectId: findSubjectId.subjectId,
        questionsWithOptions: randomizedQuestions,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method shuffleArray
   * @description Shuffle the elements of an array using the Fisher-Yates shuffle algorithm.
   *
   * @param {any[]} array - The array to be shuffled.
   * @returns {any[]} The shuffled array.
   */
  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i (inclusive)
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements at indices i and j
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  /**
   * @method evaluateTest
   * @description Evaluate a test submitted by a user and update their marks.
   *
   * @param {number} userId - ID of the user submitting the test.
   * @param {SubmitTestDto} submitTestDto - Data containing answers for evaluation.
   */
  async evaluateTest(
    userId: number,
    submitTestDto: SubmitTestDto,
  ): Promise<void> {
    try {
      const test = await this.testRepo.findTestById(submitTestDto.subjectId);

      if (!test) throw new BadRequestException('Test not found');

      const user = await this.testRepo.findUserById(userId, test.id);

      if (!user) throw new BadRequestException('User not found');

      // Initialize the mark counter and get the total number of questions in the test
      let mark = 0;
      const totalQuestions = test.questions.length;

      // Loop through each submitted answer and evaluate it
      for (const question of submitTestDto.answers) {
        // Retrieve the correct option for the question from the database
        const dbQuestionWithCorrectOption =
          await this.testRepo.findQuestionWithCorrectOption(
            +question.questionId,
          );

        // Check if the submitted answer is correct and update the mark accordingly
        question.optionId == dbQuestionWithCorrectOption?.options[0]?.id &&
        dbQuestionWithCorrectOption?.options[0]?.isCorrect == true
          ? mark++
          : mark;
      }

      // Calculate the user's score, round it, and calculate the percentage
      const score = `${mark} / ${totalQuestions}`;
      const roundScore = Math.round((mark / totalQuestions) * 100);
      const percentage = roundScore >= 0 ? roundScore : 0;

      if (await this.testRepo.findIfUserSubmittedTestAlready(user.id, test.id))
        throw new BadRequestException('The test has already been submitted.');

      await this.testRepo.updateMarks(
        userId,
        submitTestDto.subjectId,
        score,
        percentage,
      );

      await this.authService.logout(user?.email);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method reassignTest
   * @description Reassign a test to a user under specific conditions.
   *
   * @param {ReassignTestDto} reassignTestDto - Data containing user ID and subject ID for reassignment.
   */
  async reassignTest({ userId, subjectId }: ReassignTestDto): Promise<void> {
    try {
      if (!(await this.testRepo.findUserWithSubject(userId, subjectId)))
        throw new NotFoundException(
          'User associated with that test not found.',
        );

      if (!(await this.testRepo.isTestStarted(userId, subjectId)))
        throw new BadRequestException('Test not yet taken');

      if (await this.testRepo.findIfUserCompletedTestAlready(userId, subjectId))
        throw new BadRequestException(
          'The user has already completed the test.',
        );

      // Define the maximum number of reassignment attempts allowed
      const maxAttempts = 10;

      const currentAttempts = await this.testRepo.findReassignCount(
        userId,
        subjectId,
      );

      if (currentAttempts > maxAttempts)
        throw new BadRequestException(
          `The user has exceeded the limit of attending the test. Cannot reassign.`,
        );

      await this.testRepo.reassignTest(userId, subjectId);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchReassignTests
   * @description Fetch paginated reassignable tests based on specified filters.
   *
   * @param {number} page - Page number for pagination.
   * @param {string} search - Search string to filter user information.
   * @param {number} positionId - ID of the position to filter users by.
   * @param {number} subjectId - ID of the subject to filter tests by.
   * @param {DateFilter} dateFilter - Date filter type (e.g., 'on', 'before', 'after').
   * @param {string} startDate - Start date for date filtering.
   * @param {string} endDate - End date for date filtering.
   * @returns {Promise<PaginationResponse>} Promise that resolves to a PaginationResponse.
   */
  async fetchReassignTests(
    page: number,
    search: string,
    positionId: number,
    subjectId: number,
    dateFilter: DateFilter,
    startDate: string,
    endDate: string,
  ): Promise<PaginationResponse> {
    try {
      const filterByDate = dateFilterResponse(dateFilter, startDate, endDate);

      const filters: Prisma.UserTestDetailsWhereInput = {
        isStart: true,
        isFinish: false,
        isActive: true,
        updatedAt: filterByDate,
        subjectId: subjectId > 0 ? subjectId : undefined,
        user: {
          userInfo: {
            some: positionId > 0 ? { positionId } : undefined,
          },
        },
        OR:
          search.length > 0
            ? [
                {
                  user: {
                    OR: [
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
        this.testRepo.fetchReassignedTestCount(filters),
        this.testRepo.fetchReassignTests(page, itemsPerPage, filters),
      ]);

      return paginationResponse(page, total, itemsPerPage, data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
