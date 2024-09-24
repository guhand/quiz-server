import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { CreateQuestionDto, UpdateQuestionDto } from 'src/common/dto/test.dto';
import { Prisma } from '@prisma/client';
import {
  PaginationResponse,
  getErrorMessageAndStatus,
  paginationResponse,
} from 'src/common/utils/utils';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepo: QuestionRepository) {}

  /**
   * @method createQuestion
   * @description Create a new Question.
   * @param {CreateQuestionDto} data - Data to create a question.
   */
  async createQuestion({
    subjectId,
    question,
    options,
  }: CreateQuestionDto): Promise<void> {
    try {
      if (!(await this.questionRepo.isValidsubjectId(subjectId)))
        throw new NotFoundException('Subject not found');

      // Checking if none of the options have isCorrect set to true
      if (!options.some((option) => option.isCorrect)) {
        throw new BadRequestException(
          'At least one option must be marked as correct.',
        );
      }

      await this.questionRepo.createQuestion(subjectId, question, options);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchQuestions
   * @description Fetch the questions data.
   * @param {number} page - Page number.
   * @param {string} search - Filtering records based on the search.
   * @param {number} subjectId - Filtering records based on the subject.
   * @returns {Promise<PaginationResponse>} Promise that resolves to question data.
   */
  async fetchQuestions(
    page: number,
    search: string,
    subjectId: number,
  ): Promise<PaginationResponse> {
    try {
      const filters: Prisma.QuestionWhereInput = {
        subjectId: subjectId,
        isActive: true,
        question: search.length > 0 ? { contains: search } : undefined,
      };

      const itemsPerPage = 10;

      const [total, data] = await Promise.all([
        this.questionRepo.fetchQuestionsTotal(filters),
        this.questionRepo.fetchQuestions(page, itemsPerPage, filters),
      ]);

      return paginationResponse(page, total, itemsPerPage, data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updateQuestion
   * @description Update the question data.
   * @param {UpdateQuestionDto} data - Data to update a question.
   */
  async updateQuestion(data: UpdateQuestionDto): Promise<void> {
    try {
      if (!(await this.questionRepo.isValidQuestionId(data.questionId)))
        throw new BadRequestException('Question not found');

      // Checking if none of the options have isCorrect set to true
      if (!data?.options?.some((option) => option.isCorrect)) {
        throw new BadRequestException(
          'At least one option must be marked as correct.',
        );
      }

      await this.questionRepo.updateQuestion(data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
