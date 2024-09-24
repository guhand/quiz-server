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
import { QuestionService } from './question.service';
import {
  CreateQuestionDto,
  GetQuestionsDto,
  UpdateQuestionDto,
} from 'src/common/dto/test.dto';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';

@Controller('question')
@UseGuards(AdminGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /**
   * @method createQuestion
   * @description Create a new Question.
   * @param {CreateQuestionDto} createQuestionDto - DTO to create a question.
   * @returns {Promise<object>} Promise that resolves to success message.
   */
  @Post()
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<object> {
    try {
      await this.questionService.createQuestion(createQuestionDto);

      return {
        status: true,
        message: 'Question created successfully',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchQuestions
   * @description Fetch the questions data.
   * @param {GetQuestionsDto} query - Query parameters for fetching questions.
   * @returns {Promise<object>} Promise that resolves to question data.
   */
  @Get()
  async fetchQuestions(@Query() query: GetQuestionsDto): Promise<object> {
    try {
      const { page = 0, search = '', subjectId = 0 } = query;

      const data = await this.questionService.fetchQuestions(
        page,
        search ?? '',
        subjectId,
      );

      return {
        status: true,
        message: 'Questions fetched successfully',
        data,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updateQuestion
   * @description Update the question data.
   * @param {UpdateQuestionDto} updateQuestionDto - DTO to update a question.
   * @returns {Promise<object>} Promise that resolves to success message.
   */
  @Patch()
  async updateQuestion(
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<object> {
    try {
      await this.questionService.updateQuestion(updateQuestionDto);

      return {
        status: true,
        message: 'Question updated successfully',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
