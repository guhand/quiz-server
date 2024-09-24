import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Config } from '../config/config';
import { PrismaService } from '../database/prisma.service';
import { Role } from '../enum/enum';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly db: PrismaService) {}

  /**
   * @method canActivate
   * @param {ExecutionContext} context - ExecutionContext object provided by NestJS.
   * @returns {Promise<boolean>} A boolean indicating whether the user is a super admin.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Extract the request object from the execution context
      const req = context.switchToHttp().getRequest();

      // Extract the token from the authorization header
      const token = req.headers.authorization?.split(' ')[1];

      if (token) {
        // Verify the token using the secret key
        const verificationResponse: any = verify(token, Config.secretKey);

        if (verificationResponse) {
          // Find the user in the database based on the verified user ID, token, and super admin role
          const findUser = await this.db.user.findFirst({
            where: {
              id: +verificationResponse.userId,
              isActive: true,
              token,
              roleId: Role.SuperAdmin,
            },
          });

          if (!findUser) {
            // Return false if the user is not found or is not a super admin
            return false;
          }

          // Set the user object in the request for future use
          req.user = findUser;
          return true;
        } else {
          throw new UnauthorizedException('Invalid token');
        }
      } else {
        throw new UnauthorizedException('Token missing');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
