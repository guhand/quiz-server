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
import { TestService } from './test.service';
import {
  AssignTestDto,
  CreateSubjectDto,
  SubmitTestDto,
  GetReassignedTestDto,
  GetSubjectsDto,
  ReassignTestDto,
  UpdateSubjectDto,
} from 'src/common/dto/test.dto';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { SuperAdminGuard } from 'src/common/guard/superAdmin.guard';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';
import { CurrentUser } from 'src/common/decorators/decorators';
import { DateFilter } from 'src/common/enum/enum';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  /**
   * @method createSubject
   * @description Create a new subject.
   * @param {CreateSubjectDto} createSubjectDto - Data for creating a subject.
   * @returns {Object} Response object indicating the success status and message.
   */
  @Post()
  @UseGuards(AdminGuard)
  async createSubject(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<object> {
    try {
      await this.testService.createSubject(createSubjectDto);

      return {
        status: true,
        message: 'Subject created successfully',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchSubjects
   * @description Fetch a paginated list of subjects.
   * @param {GetSubjectsDto} getSubjectsDto - Query parameters for pagination and search.
   * @returns {Promise<object>} Promise that resolves to a response object indicating the success status, message, and fetched data.
   */
  @Get()
  @UseGuards(AdminGuard)
  async fetchSubjects(
    @Query() { page = 0, search = '' }: GetSubjectsDto,
  ): Promise<object> {
    try {
      const data = await this.testService.fetchSubjects(page, search);

      return {
        status: true,
        message: 'Subjects fetched successfully',
        data,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updateSubject
   * @description Update an existing subject.
   * @param {UpdateSubjectDto} updateSubjectDto - Data for updating a subject.
   * @returns {Promise<object>} Promise that resolves to a response object indicating the success status and message.
   */
  @Patch()
  @UseGuards(AdminGuard)
  async updateSubject(
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<object> {
    try {
      await this.testService.updateSubject(updateSubjectDto);

      return {
        status: true,
        message: 'Subject updated successfully',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @route /assign-test
   * @method assignTest
   * @description Assign a test subject to the user.
   * @param {AssignTestDto} assignTestDto - Data to assign a subject to the user.
   * @returns {Promise<object>} Promise that resolves to a response object indicating the success status and message.
   */
  @Post('assign-test')
  @UseGuards(AdminGuard)
  async assignTest(@Body() assignTestDto: AssignTestDto): Promise<object> {
    try {
      await this.testService.assignTest(assignTestDto);

      return {
        status: true,
        message: 'Test assigned to the user successfully',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @route /start-test
   * @method startTest
   * @description Start a test for the authenticated user.
   * @param {any} user - Current user obtained from the @CurrentUser decorator.
   * @returns {Promise<object>} Promise that resolves to a response object indicating the success status, message, and test data.
   */
  @Get('start-test')
  @UseGuards(AuthGuard)
  async startTest(@CurrentUser() user: any): Promise<object> {
    try {
      const data = await this.testService.startTest(+user?.id);

      return {
        status: true,
        message: 'Test started',
        data,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @route /submit-test
   * @method submitTest
   * @description Evaluate a test submitted by the authenticated user.
   * @param {any} user - Current user obtained from the @CurrentUser decorator.
   * @param {SubmitTestDto} submitTestDto - Data containing answers for evaluation.
   * @returns {Promise<object>} Promise that resolves to a response object indicating the success status and message.
   */
  @Post('submit-test')
  @UseGuards(AuthGuard)
  async submitTest(
    @CurrentUser() user: any,
    @Body() submitTestDto: SubmitTestDto,
  ): Promise<object> {
    try {
      await this.testService.evaluateTest(+user?.id, submitTestDto);

      return {
        status: true,
        message: 'Test submitted successfully',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @route /test-reassign
   * @method reassignTest
   * @description Reassign a test to a user.
   * @param {ReassignTestDto} reassignTestDto - Data for reassigning a test.
   * @returns {Promise<object>} Promise that resolves to a response object indicating the success status and message.
   */
  @Patch('test-reassign')
  @UseGuards(SuperAdminGuard)
  async reassignTest(
    @Body() reassignTestDto: ReassignTestDto,
  ): Promise<object> {
    try {
      await this.testService.reassignTest(reassignTestDto);

      return {
        status: true,
        message: 'Test reassigned to user successfully',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @route /get-reassign-tests
   * @method fetchReassignTests
   * @description Fetch paginated reassigned tests based on specified filters.
   * @param {GetReassignedTestDto} getReassignedTestDto - Query parameters for pagination and filtering.
   * @returns {Promise<object>} Promise that resolves to a response object indicating the success status, message, and fetched data.
   */
  @Get('get-reassign-tests')
  @UseGuards(SuperAdminGuard)
  async fetchReassignTests(
    @Query()
    {
      page = 0,
      search = '',
      positionId = 0,
      subjectId = 0,
      dateFilter = DateFilter.All,
      startDate = undefined,
      endDate = undefined,
    }: GetReassignedTestDto,
  ): Promise<object> {
    try {
      const data = await this.testService.fetchReassignTests(
        page,
        search,
        positionId,
        subjectId,
        dateFilter,
        startDate,
        endDate,
      );

      return {
        status: true,
        message: 'Reassigned Tests fetched successfully',
        data,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
