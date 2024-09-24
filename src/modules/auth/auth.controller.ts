import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LogoutDto } from 'src/common/dto/login.dto';
import { getErrorMessageAndStatus } from 'src/common/utils/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @method login
   * @description Handle user login using provided credentials.
   * @param {LoginDto} credentials - User login credentials.
   * @returns {Promise<object>} Response object indicating the success status, message, and additional data.
   */
  @Post('login')
  async login(@Body() credentials: LoginDto): Promise<object> {
    try {
      const data = await this.authService.login(credentials);

      return {
        status: true,
        message: 'Login successful',
        data,
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }

  /**
   * @method logout
   * @description Handle user logout using middleware data.
   * @param {any} user - Current user object.
   * @returns {Promise<object>} Response object indicating the success status, message.
   */
  @Post('logout')
  async logout(@Body() logoutDto: LogoutDto): Promise<object> {
    try {
      await this.authService.logout(logoutDto.email);

      return {
        status: true,
        message: 'Logout successful',
      };
    } catch (error) {
      const { message, status } = getErrorMessageAndStatus(error);
      throw new HttpException(message, status);
    }
  }
}
