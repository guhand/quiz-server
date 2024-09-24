import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import {
  CreateUserDto,
  UpdateUserDto,
  UploadBulkUsersDto,
} from 'src/common/dto/user.dto';
import {
  DateFilter,
  ErrorMessage,
  ExperienceLevel,
  Role,
} from 'src/common/enum/enum';
import { Prisma } from '@prisma/client';
import {
  ExcelRequiredFields,
  PaginationResponse,
  dateFilterResponse,
  getErrorMessageAndStatus,
  paginationResponse,
} from 'src/common/utils/utils';
import * as xlsx from 'xlsx';
import { REQUIRED_COLUMNS_FOR_EXCEL_UPLOAD } from 'src/common/constant/constant';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  /**
   * @method createUser
   * @description Create a new user based on the provided data and user's role.
   * @param {number} roleId - Role ID of the user creating the new user.
   * @param {CreateUserDto} data - DTO containing information to create a new user.
   */
  async createUser(roleId: number, data: CreateUserDto) {
    try {
      if (await this.userRepo.isExistingEmail(data.email))
        throw new BadRequestException(ErrorMessage.EmailAlreadyExist);

      if (await this.userRepo.isExistingMobile(data.mobile))
        throw new BadRequestException(ErrorMessage.MobileAlreadyExist);

      // If the user role is Admin or Super_Admin, check if the creator is a Super_Admin
      if (data.roleId == Role.Admin || data.roleId == Role.SuperAdmin)
        if (roleId == Role.SuperAdmin) await this.userRepo.createAdmin(data);
        else
          throw new BadRequestException(
            'Only a Super Admin can create an Admin.',
          );
      // If the user role is User, create a regular user
      else if (data.roleId == Role.User) await this.userRepo.createUser(data);
      else
        throw new HttpException(
          'Failed to create a user',
          HttpStatus.BAD_REQUEST,
        );
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updateUser
   * @description Update user details based on the provided data and user's role.
   * @param {number} roleId - Role ID of the user updating the user details.
   * @param {UpdateUserDto} data - DTO containing information to update user details.
   */
  async updateUser(roleId: number, data: UpdateUserDto) {
    try {
      const findUser = await this.userRepo.findUserById(data.userId);

      if (!findUser) throw new NotFoundException('User not found');

      // Check if the provided email already exists in the database for other users
      if (await this.userRepo.isEmailExistExceptId(data.userId, data.email))
        throw new BadRequestException(ErrorMessage.EmailAlreadyExist);

      // Check if the provided mobile number already exists in the database for other users
      if (await this.userRepo.isMobileExistExceptId(data.userId, data.mobile))
        throw new BadRequestException(ErrorMessage.MobileAlreadyExist);

      // If the user role is Admin, check if the updater is a Super_Admin
      if (findUser.roleId == Role.Admin)
        if (roleId == Role.SuperAdmin) await this.userRepo.updateAdmin(data);
        else
          throw new BadRequestException(
            'Only a Super Admin can update an Admin.',
          );
      else if (findUser.roleId == Role.User)
        await this.userRepo.updateUser(data);
      else
        throw new HttpException(
          'Failed to update a user',
          HttpStatus.BAD_REQUEST,
        );
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchUsers
   * @description Fetch users based on provided parameters and pagination details.
   * @param {number} page - Page number for pagination.
   * @param {string} search - Search string to filter users.
   * @param {number} positionId - Position ID to filter users by position.
   * @param {DateFilter} dateFilter - Date filter enumeration to specify the time range.
   * @param {string} startDate - Start date for date range filter.
   * @param {string} endDate - End date for date range filter.
   * @returns {Promise<PaginationResponse>} Promise containing the paginated response with user data.
   */
  async fetchUsers(
    page: number,
    search: string,
    roleId: number,
    positionId: number,
    subjectId: number,
    experienceLevel: number,
    dateFilter: DateFilter,
    startDate: string,
    endDate: string,
  ): Promise<PaginationResponse> {
    try {
      // Get date filter based on provided parameters
      const filterByDate = dateFilterResponse(dateFilter, startDate, endDate);

      /**
       * Split the search query into an array of words using the space character as a delimiter.
       * So that we can able to search a fullName.
       */
      const name: string[] = search.split(' ');

      const filters: Prisma.UserWhereInput = {
        isActive: true,
        createdAt: filterByDate,
        roleId: { notIn: [Role.SuperAdmin] },
        role: roleId > 0 ? { id: roleId } : undefined,
        userTestDetails:
          subjectId > 0
            ? {
                some: { isActive: true, subjectId },
              }
            : undefined,
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
        OR:
          search.length > 0
            ? [
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
              ]
            : undefined,
      };

      const itemsPerPage = 10;

      const [total, data] = await Promise.all([
        this.userRepo.findTotalUsers(filters),
        this.userRepo.fetchUsers(page, itemsPerPage, filters),
      ]);

      return paginationResponse(page, total, itemsPerPage, data);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method uploadBulkUsers
   * @description Upload bulk users based on the provided Excel file and additional parameters.
   * @param {Express.Multer.File} file - Uploaded Excel file containing user data.
   * @param {UploadBulkUsersDto} dto - Additional parameters including subjectId and positionId.
   */
  async uploadBulkUsers(
    file: Express.Multer.File,
    { subjectId, positionId }: UploadBulkUsersDto,
  ): Promise<void> {
    try {
      // Read the Excel file using xlsx library
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data: any[] = xlsx.utils.sheet_to_json(sheet);

      // Validate the data using the isValidData method
      const validData = await this.isValidData(data);

      if (!validData)
        throw new BadRequestException('Wrong data provided in the Excel sheet');

      // Iterate over the valid data and upload users in bulk
      for (const item of validData) {
        await this.userRepo.uploadBulkUsers(item, positionId, subjectId);
      }
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   *
   * @method isValidData
   * @description This method performs multiple validations on the provided user data,
   *              including checking for required columns, valid email and mobile formats,
   *              and detecting duplicate entries. It also checks for existing email and
   *              mobile numbers in the database, and formats the data for bulk upload.
   *              If any validation fails, it throws a BadRequestException with a detailed
   *              error message.
   * @param {any[]} data - Array of user data to be validated.
   * @returns {Promise<ExcelRequiredFields[]>} Promise with the valid user data ready for bulk upload.
   */
  async isValidData(data: any[]): Promise<ExcelRequiredFields[]> {
    // Assuming the first row contains column names
    const uploadedColumns = Object.keys(data[0]);
    const errorFields = [];

    // Check if required columns are present in the uploaded data
    for (const column of REQUIRED_COLUMNS_FOR_EXCEL_UPLOAD) {
      if (!uploadedColumns.includes(column)) {
        errorFields.push(column);
      }
    }

    // Throw an exception if required columns are missing
    if (errorFields.length) {
      throw new BadRequestException(
        `Column names must match the following ${
          errorFields.length == 1 ? 'field' : 'fields'
        } : ${errorFields}`,
      );
    }

    const emailSet: any = new Set();
    const mobileSet: any = new Set();
    const duplicateData: ExcelRequiredFields[] = [];

    for (const item of data) {
      if (!this.isValidEmail(item['Email'])) {
        throw new BadRequestException(
          `This ${item['Email']} is not a valid email`,
        );
      } else if (!this.isValidIndianMobileNumber(item['Mobile'])) {
        throw new BadRequestException(
          `This ${item['Mobile']} is not a valid mobile number`,
        );
      } else if (emailSet.has(item['Email']) || mobileSet.has(item['Mobile'])) {
        duplicateData.push(item);
      } else {
        emailSet.add(String(item['Email']));
        mobileSet.add(String(item['Mobile']));
      }
    }

    if (duplicateData.length) {
      throw new BadRequestException(
        `Duplicate email or mobile found for the following email: ${duplicateData.map(
          (user) => user?.Email,
        )}`,
      );
    }

    const userEmailAlreadyExist =
      await this.userRepo.checkEmailsAlreadyExistInList([...emailSet]);
    const userMobileAlreadyExist =
      await this.userRepo.checkMobileNumbersAlreadyExistInList([...mobileSet]);

    // Throw an exception if existing email or mobile numbers are found
    if (userEmailAlreadyExist.isExisting) {
      const existingUserList = userEmailAlreadyExist.data.map(
        (user) => user.email,
      );
      throw new BadRequestException(
        `Email already exists for the following ${
          existingUserList.length == 1 ? 'user' : 'users'
        } : ${existingUserList}`,
      );
    }

    if (userMobileAlreadyExist.isExisting) {
      const existingUserList = userMobileAlreadyExist.data.map(
        (user) => user.mobile,
      );
      throw new BadRequestException(
        `Mobile already exists for the following ${
          existingUserList.length == 1 ? 'user' : 'users'
        } : ${existingUserList}`,
      );
    }

    const input: ExcelRequiredFields[] = [];

    // Format data for bulk upload and handle special cases like date of birth
    for (const item of data) {
      for (const field of REQUIRED_COLUMNS_FOR_EXCEL_UPLOAD) {
        item[field] = this.removeWhiteSpaces(String(item[field]));

        // Convert Excel date to valid date format
        if (field == 'DOB' && !(typeof item[field] == 'string')) {
          item[field] = this.getJsDateFromExcel(item[field]);
        }
      }
      input.push(item);
    }

    return data.length == input.length ? input : undefined;
  }

  /**
   * @method isValidEmail
   * @description Validate whether the provided email follows a standard email format.
   * @param {string} email - Email address to be validated.
   * @returns {boolean} True if the email is in a valid format, otherwise false.
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * @method isValidIndianMobileNumber
   * @description Validate whether the provided mobile number follows the standard format for Indian mobile numbers.
   * @param {string} phoneNumber - Mobile number to be validated.
   * @returns {boolean} True if the mobile number is in a valid format, otherwise false.
   */
  private isValidIndianMobileNumber(phoneNumber: string): boolean {
    const mobileNumberRegex = /^[6-9]{1}[0-9]{9}$/;
    return mobileNumberRegex.test(phoneNumber);
  }

  /**
   * @method getJsDateFromExcel
   * @description Convert an Excel date to a standard date format (YYYY-MM-DD).
   * @param {number} excelDate - Excel date to be converted.
   * @returns {string} Standard date format (YYYY-MM-DD).
   */
  private getJsDateFromExcel(excelDate: number): string {
    const SECONDS_IN_DAY = 24 * 60 * 60;
    const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000;
    const MAGIC_NUMBER_OF_DAYS = 25567 + 2;

    if (!Number(excelDate)) {
      throw new BadRequestException(
        'Wrong date format. Date column should be in the format of date and it should be in "YYYY-MM-DD" format',
      );
    }

    const delta = excelDate - MAGIC_NUMBER_OF_DAYS;
    const parsed = delta * MISSING_LEAP_YEAR_DAY;
    const date = new Date(parsed).toISOString().split('T')[0];

    return date;
  }

  /**
   * @method removeWhiteSpaces
   * @description Remove extra white spaces from the provided input.
   * @param {string} input - Input string with potential extra white spaces.
   * @returns {string} Input string with extra white spaces removed.
   */
  private removeWhiteSpaces(input: string): string {
    try {
      return input.replace(/\s+/g, ' ').trim();
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}

// private isValidDateFormat(dateString: string): boolean {
//   try {
//     const regEx = /^\d{4}-\d{2}-\d{2}$/;
//     if (!dateString.match(regEx)) return false; // Invalid format
//     const d = new Date(dateString);
//     const dNum = d.getTime();
//     if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
//     return d.toISOString().slice(0, 10) === dateString;
//   } catch (error) {
//     const { message, status } = getErrorMessageAndStatus(error);
//     throw new HttpException(message, status);
//   }
// }
