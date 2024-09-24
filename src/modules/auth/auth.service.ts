import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { LoginDto } from 'src/common/dto/login.dto';
import { ErrorMessage, Role } from 'src/common/enum/enum';
import {
  getErrorMessageAndStatus,
  generateToken,
} from 'src/common/utils/utils';
import { AuthRespository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepo: AuthRespository) {}

  /**
   * @method login
   * @description Perform user login based on provided credentials.
   * @param {LoginDto} credentials - User login credentials.
   * @returns {Promise<Object>} Promise that resolves to the authentication data.
   */
  async login({ email, password }: LoginDto): Promise<object> {
    try {
      const findUser = await this.authRepo.isExistingUser(email);

      if (!findUser)
        throw new HttpException(
          ErrorMessage.NotAExistingUser,
          HttpStatus.BAD_REQUEST,
        );

      if (!(await this.authRepo.CheckPassword(findUser.id, password)))
        throw new HttpException(
          ErrorMessage.PasswordMismatch,
          HttpStatus.BAD_REQUEST,
        );

      const token = await generateToken(findUser.id);

      const updateToken = await this.authRepo.updateToken(
        findUser.id,
        findUser.roleId,
        token,
      );

      // If the user has an admin or super admin role, return the updated token
      if (findUser.roleId == Role.Admin || findUser.roleId == Role.SuperAdmin)
        return { user: updateToken };

      // If the user has a user role, additional checks can be added here
      if (findUser.roleId == Role.User) {
        // Check if a test is assigned to the user or not
        if (findUser?.userTestDetails?.length == 0)
          throw new BadRequestException(
            'Test has not been assigned to the user. Cannot proceed.',
          );
        // Check if the user has already started the test or not
        else if (findUser?.userTestDetails[0]?.isStart == true)
          throw new BadRequestException(
            'Test already taken. In case there were any network issues during the test, please contact HR for assistance.',
          );

        const questionCount = await this.authRepo.findQuestionCount(
          findUser?.userTestDetails[0]?.subjectId,
        );

        return { user: updateToken, questionCount };
      }
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  async logout(email: string): Promise<void> {
    try {
      const user = await this.authRepo.isExistingUser(email);

      if (!user)
        throw new HttpException(
          ErrorMessage.NotAExistingUser,
          HttpStatus.BAD_REQUEST,
        );

      await this.authRepo.logout(user?.id);
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
