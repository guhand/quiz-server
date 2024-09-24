import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, Question, Test } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { CreateOptionDto, UpdateQuestionDto } from 'src/common/dto/test.dto';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';

@Injectable()
export class QuestionRepository {
  constructor(private readonly db: PrismaService) {}

  /**
   * @method isValidsubjectId
   * @description Find a subject is a valid subject or not.
   * @param {number} subjectId - Subject ID.
   * @returns {Promise<Test>} Promise that resolves to subject data.
   */
  async isValidsubjectId(subjectId: number): Promise<Test> {
    try {
      return await this.db.test.findFirst({
        where: { id: subjectId, isActive: true },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method createQuestion
   * @description Create a new Question.
   * @param {number} subjectId - To create a question in a particular subject.
   * @param {string} question - To create a question.
   * @param {CreateOptionDto[]} options - To create options.
   */
  async createQuestion(
    subjectId: number,
    question: string,
    options: CreateOptionDto[],
  ): Promise<void> {
    try {
      await this.db.question.create({
        data: {
          subjectId,
          question,
          options: {
            create: options.map((option) => ({
              option: option.option,
              isCorrect: option.isCorrect,
            })),
          },
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchQuestionsTotal
   * @description Fetch the questions count.
   * @param {Prisma.QuestionWhereInput} filters - Filtering records based on the filter condition.
   * @returns {Promise<number>} Promise that resolves to questions count.
   */
  async fetchQuestionsTotal(
    filters: Prisma.QuestionWhereInput,
  ): Promise<number> {
    try {
      return await this.db.question.count({ where: filters });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchQuestions
   * @description Fetch the questions data.
   * @param {number} page - Page number.
   * @param {number} itemsPerPage - Items per page to display records.
   * @param {Prisma.QuestionWhereInput} filters - Filtering records based on the filter condition.
   * @returns {Promise<Question[]>} Promise that resolves to questions data.
   */
  async fetchQuestions(
    page: number,
    itemsPerPage: number,
    filters: Prisma.QuestionWhereInput,
  ): Promise<Question[]> {
    try {
      return await this.db.question.findMany({
        where: filters,
        skip: page > 1 ? (page - 1) * itemsPerPage : undefined,
        take: page > 0 ? itemsPerPage : undefined,
        include: {
          options: {
            where: { isActive: true },
            select: { id: true, option: true, isCorrect: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method isValidQuestionId
   * @description Find the question is a valid question or not.
   * @param {number} id - Question ID.
   * @returns {Promise<Question>} Promise that resolves to question data.
   */
  async isValidQuestionId(id: number): Promise<Question> {
    try {
      return await this.db.question.findFirst({
        where: { id, isActive: true },
      });
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
  async updateQuestion({
    questionId,
    question,
    options,
  }: UpdateQuestionDto): Promise<void> {
    try {
      await this.db.question.update({
        where: { id: questionId },
        data: {
          question,
          options: {
            updateMany: {
              where: { isActive: true },
              data: { isActive: false },
            },
            create: options.map((option) => ({
              ...option,
            })),
          },
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
