import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { CreateUserDto, UpdateUserDto } from 'src/common/dto/user.dto';
import { Role } from 'src/common/enum/enum';
import {
  ExcelRequiredFields,
  getErrorMessageAndStatus,
} from 'src/common/utils/utils';

@Injectable()
export class UserRepository {
  constructor(private readonly db: PrismaService) {}

  /**
   * @method createAdmin
   * @description Creates an admin user in the database.
   * @param {CreateUserDto} userDto - DTO containing user details for admin creation.
   */
  async createAdmin({
    firstName,
    lastName,
    email,
    mobile,
    roleId,
  }: CreateUserDto): Promise<void> {
    try {
      await this.db.user.create({
        data: { firstName, lastName, email, mobile, roleId },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method createUser
   * @description Creates a user in the database with additional user information.
   * @param {CreateUserDto} userDto - DTO containing user details for user creation.
   */
  async createUser({
    firstName,
    lastName,
    email,
    mobile,
    roleId,
    dob,
    college,
    degree,
    specialization,
    positionId,
    isFresher,
    yearsOfExperience: experience,
  }: CreateUserDto): Promise<void> {
    try {
      await this.db.user.create({
        data: {
          firstName,
          lastName,
          email,
          mobile,
          roleId,
          userInfo: {
            create: {
              dob,
              college,
              degree,
              specialization,
              positionId,
              isFresher,
              yearsOfExperience: !isFresher ? experience : undefined,
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
   * @method isExistingEmail
   * @description Checks if the provided email already exists in the database.
   * @param {string} email - Email to check for existence.
   * @returns {Promise<boolean>} Promise that resolves with the result of the email existence check.
   */
  async isExistingEmail(email: string): Promise<boolean> {
    try {
      return (
        (await this.db.user.count({ where: { isActive: true, email } })) > 0
      );
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method isExistingMobile
   * @description Checks if the provided mobile number already exists in the database.
   * @param {string} mobile - Mobile number to check for existence.
   * @returns {Promise<boolean>} Promise that resolves with the result of the mobile number existence check.
   */
  async isExistingMobile(mobile: string): Promise<boolean> {
    try {
      return (
        (await this.db.user.count({ where: { isActive: true, mobile } })) > 0
      );
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method isEmailExistExceptId
   * @description Checks if the provided email already exists in the database, excluding a specific user ID.
   * @param {number} userId - ID of the user to exclude from the check.
   * @param {string} email - Email to check for existence.
   * @returns {Promise<boolean>} Promise that resolves with the result of the email existence check.
   */
  async isEmailExistExceptId(userId: number, email: string): Promise<boolean> {
    try {
      return (
        (await this.db.user.count({
          where: { isActive: true, email, id: { not: userId } },
        })) > 0
      );
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method isMobileExistExceptId
   * @description Checks if the provided mobile number already exists in the database, excluding a specific user ID.
   * @param {number} userId - ID of the user to exclude from the check.
   * @param {string} mobile - Mobile number to check for existence.
   * @returns {Promise<boolean>} Promise that resolves with the result of the mobile number existence check.
   */
  async isMobileExistExceptId(
    userId: number,
    mobile: string,
  ): Promise<boolean> {
    try {
      return (
        (await this.db.user.count({
          where: { isActive: true, mobile, id: { not: userId } },
        })) > 0
      );
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updateAdmin
   * @description Updates the details of an admin user in the database.
   * @param {UpdateUserDto} userDto - DTO containing user details for admin update.
   */
  async updateAdmin({
    userId,
    firstName,
    lastName,
    email,
    mobile,
  }: UpdateUserDto): Promise<void> {
    try {
      await this.db.user.update({
        where: { id: userId, isActive: true },
        data: { firstName, lastName, email, mobile },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updateUser
   * @description Updates the details of a user in the database, including additional user information.
   * @param {UpdateUserDto} userDto - DTO containing user details for user update.
   */
  async updateUser({
    userId,
    firstName,
    lastName,
    email,
    mobile,
    dob,
    college,
    degree,
    specialization,
    positionId,
    isFresher,
    yearsOfExperience,
  }: UpdateUserDto): Promise<void> {
    try {
      await this.db.user.update({
        where: { id: userId, isActive: true },
        data: {
          firstName,
          lastName,
          email,
          mobile,
          userInfo: {
            updateMany: {
              where: { userId },
              data: {
                dob,
                college,
                degree,
                specialization,
                positionId,
                isFresher,
                yearsOfExperience: !isFresher ? yearsOfExperience : null,
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
   * @description Retrieves a user by ID from the database.
   * @param {number} id - ID of the user to retrieve.
   * @returns {Promise<User | null>} Promise that resolves with the retrieved user or null if not found.
   */
  async findUserById(id: number): Promise<User | null> {
    try {
      return await this.db.user.findFirst({ where: { id, isActive: true } });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method findTotalUsers
   * @description Counts the total number of users in the database based on specified filters.
   * @param {Prisma.UserWhereInput} filters - Filters to apply while counting users.
   * @returns {Promise<number>} Promise that resolves with the total number of users.
   */
  async findTotalUsers(filters: Prisma.UserWhereInput): Promise<number> {
    try {
      return await this.db.user.count({ where: filters });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method fetchUsers
   * @description Fetches a list of users from the database based on specified filters, pagination, and selection.
   * @param {number} page - Page number for pagination.
   * @param {number} itemsPerPage - Number of items to fetch per page.
   * @param {Prisma.UserWhereInput} filters - Filters to apply while fetching users.
   * @returns {Users} Promise that resolves with an array of users based on the specified criteria.
   */
  async fetchUsers(
    page: number,
    itemsPerPage: number,
    filters: Prisma.UserWhereInput,
  ) {
    try {
      return await this.db.user.findMany({
        where: filters,
        skip: page > 1 ? (page - 1) * itemsPerPage : undefined,
        take: page > 0 ? itemsPerPage : undefined,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
          createdAt: true,
          role: { select: { id: true, role: true } },
          userInfo: {
            where: { isActive: true },
            select: {
              college: true,
              degree: true,
              specialization: true,
              isFresher: true,
              yearsOfExperience: true,
              dob: true,
              position: { select: { id: true, position: true } },
            },
          },
          userTestDetails: {
            where: { isActive: true },
            select: { test: { select: { id: true, subject: true } } },
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
   * @method uploadBulkUsers
   * @description Creates multiple user records in bulk based on provided data and related information.
   * @param {ExcelRequiredFields} data - Excel data containing required user fields.
   * @param {number} positionId - ID of the position associated with the users.
   * @param {number} subjectId - ID of the subject associated with the users.
   */
  async uploadBulkUsers(
    data: ExcelRequiredFields,
    positionId: number,
    subjectId: number,
  ): Promise<void> {
    try {
      await this.db.user.create({
        data: {
          firstName: data['FirstName'],
          lastName: data['LastName'],
          email: data['Email'],
          mobile: String(data['Mobile']),
          roleId: Role.User,
          userInfo: {
            create: {
              dob: String(data['DOB']),
              positionId: positionId,
              college: data['College'],
              degree: data['Degree'],
              specialization: data['Specialization'],
              isFresher: true,
              yearsOfExperience: undefined,
            },
          },
          userTestDetails: { create: { subjectId } },
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method checkEmailsAlreadyExistInList
   * @description Checks if any emails in the provided list already exist in the database.
   * @param {string[]} emailList - List of emails to check for existence.
   * @returns {Promise<{ isExisting: boolean, data?: User[] }>} Promise that resolves with existence status and existing data if applicable.
   */
  async checkEmailsAlreadyExistInList(
    emailList: string[],
  ): Promise<{ isExisting: boolean; data?: User[] }> {
    try {
      const existingData = await this.db.user.findMany({
        where: { email: { in: emailList } },
      });

      if (existingData.length) {
        return { isExisting: true, data: existingData };
      } else {
        return { isExisting: false };
      }
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method checkMobileNumbersAlreadyExistInList
   * @description Checks if any mobile numbers in the provided list already exist in the database.
   * @param {string[]} mobileList - List of mobile numbers to check for existence.
   * @returns {Promise<{ isExisting: boolean, data?: User[] }>} Promise that resolves with existence status and existing data if applicable.
   */
  async checkMobileNumbersAlreadyExistInList(
    mobileList: string[],
  ): Promise<{ isExisting: boolean; data?: User[] }> {
    try {
      const existingData = await this.db.user.findMany({
        where: { mobile: { in: mobileList } },
      });

      if (existingData.length) {
        return { isExisting: true, data: existingData };
      } else {
        return { isExisting: false };
      }
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
