import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { initDB } from './init.db';

/**
 * @class PrismaService
 * @extends PrismaClient
 * @implements OnModuleInit
 * @description Custom service extending PrismaClient and implementing OnModuleInit lifecycle hook.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * @method onModuleInit
   * @description Lifecycle hook method called when the module is initialized.
   *              Connects to the database and initializes it using the initDB function.
   */
  async onModuleInit() {
    // Connect to the database
    await this.$connect();

    // Initialize the database using the initDB function
    await initDB(this);
  }
}
