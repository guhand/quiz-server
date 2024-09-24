import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { Role } from 'src/common/enum/enum';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';

@Injectable()
export class AuthRespository {
  constructor(private readonly db: PrismaService) {}

  /**
   * @method isExistingUser
   * @description Check if a user with the provided email exists.
   * @param {string} email - User email to check for existence.
   * @returns {Promise<User>} Promise that resolves to the user object if found, otherwise null.
   */
  async isExistingUser(email: string) {
    try {
      return await this.db.user.findFirst({
        where: {
          isActive: true,
          email,
        },
        include: {
          userTestDetails: {
            where: { isActive: true },
          },
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method isPasswordValid
   * @description Check if the provided password matches the stored password for a user.
   * @param {number} id - User ID.
   * @param {string} password - Password to check for validity.
   * @returns {Promise<User>} Promise that resolves to the user object if password is valid, otherwise null.
   */
  async CheckPassword(id: number, password: string): Promise<User> {
    try {
      return await this.db.user.findFirst({ where: { id, mobile: password } });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method updateToken
   * @description Update user token and, if the user has a 'User' role, set the 'isStart' flag for active userTestDetails.
   * @param {number} id - User ID.
   * @param {number} roleId - User role ID.
   * @param {string} token - New authentication token.
   * @returns {Promise<Object>} Promise that resolves to the updated user object.
   */
  async updateToken(id: number, roleId: number, token: string) {
    try {
      return await this.db.user.update({
        where: { isActive: true, id },
        data:
          // Check the role Id to update a isStart flag
          roleId == Role.User
            ? {
                token,
                userTestDetails: {
                  updateMany: {
                    where: { isActive: true },
                    data: { isStart: true },
                  },
                },
              }
            : { token },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          token: true,
          role: { select: { id: true, role: true } },
          userInfo:
            roleId == Role.User
              ? {
                  select: {
                    position: { select: { id: true, position: true } },
                  },
                }
              : undefined,
        },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method findQuestionCount
   * @description Find Question count
   * @param {number} subjectId - Subject ID.
   * @returns {Promise<number>} Promise that resolves to the return a question count.
   */
  async findQuestionCount(subjectId: number): Promise<number> {
    try {
      return await this.db.question.count({
        where: { subjectId, isActive: true },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method logout
   * @description Logout the session by updating the token field to null.
   */
  async logout(userId: number): Promise<void> {
    try {
      await this.db.user.update({
        data: { token: null },
        where: { id: userId },
      });
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
