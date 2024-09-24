import { HttpException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Subject } from '../enum/enum';
import {
  ROLES,
  POSITIONS,
  SUBJECTS,
  EMBEDDED_QUESTIONS as EMBEDDED_QUESTIONS,
  JS_QUESTIONS,
  USERS,
} from '../constant/constant';
import { getErrorMessageAndStatus } from '../utils/utils';

/**
 * @function initRoles
 * @description Initialize roles in the database if they don't exist.
 * @param {PrismaService} prisma - Prisma service instance.
 */
async function initRoles(prisma: PrismaService) {
  const isExist = (await prisma.role.count()) > 0;

  if (!isExist) {
    for (const role of ROLES) {
      await prisma.role.create({ data: { role } });
    }
  }
}

/**
 * @function initPositions
 * @description Initialize positions in the database if they don't exist.
 * @param {PrismaService} prisma - Prisma service instance.
 */
async function initPositions(prisma: PrismaService) {
  const isExist = (await prisma.position.count()) > 0;
  if (!isExist) {
    for (const position of POSITIONS) {
      await prisma.position.create({ data: { position } });
    }
  }
}

/**
 * @function initSubjects
 * @description Initialize subjects in the database if they don't exist.
 * @param {PrismaService} prisma - Prisma service instance.
 */
async function initSubjects(prisma: PrismaService) {
  const isExist = (await prisma.test.count()) > 0;

  if (!isExist) {
    for (const subject of SUBJECTS) {
      await prisma.test.create({ data: { subject } });
    }
  }
}

/**
 * @function initJSQuestions
 * @description Initialize JavaScript quesitions in the database if they don't exist.
 * @param {PrismaService} prisma - Prisma service instance.
 */
async function initJSQuestions(prisma: PrismaService) {
  const isExist =
    (await prisma.question.count({
      where: { subjectId: Subject.JavaScript },
    })) > 0;

  if (!isExist) {
    for (const question of JS_QUESTIONS) {
      await prisma.question.create({
        data: {
          subjectId: Subject.JavaScript,
          question: question.question,
          options: {
            create: question.options.map((v) => ({
              option: v.option,
              isCorrect: v.isCorrect,
            })),
          },
        },
      });
    }
  }
}

/**
 * @function initEmbededQuestions
 * @description Initialize Embedded quesitions in the database if they don't exist.
 * @param {PrismaService} prisma - Prisma service instance.
 */
async function initEmbededQuestions(prisma: PrismaService) {
  const isExist =
    (await prisma.question.count({
      where: { subjectId: Subject.Embedded },
    })) > 0;

  if (!isExist) {
    for (const question of EMBEDDED_QUESTIONS) {
      await prisma.question.create({
        data: {
          subjectId: Subject.Embedded,
          question: question.question,
          options: {
            create: question.options.map((v) => ({
              option: v.option,
              isCorrect: v.isCorrect,
            })),
          },
        },
      });
    }
  }
}

/**
 * @function initAdmins
 * @description Initialize predefined admin users in the database if they don't exist.
 * @param {PrismaService} prisma - Prisma service instance.
 */
async function initAdmins(prisma: PrismaService) {
  const isExist = (await prisma.user.count()) > 0;
  if (!isExist) {
    for (const user of USERS) {
      await prisma.user.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          roleId: user.roleId,
        },
      });
    }
  }
}

/**
 * @function initDB
 * @description Initialize the entire database with roles, positions, subjects, questions and admin users.
 * @param {PrismaService} prisma - Prisma service instance.
 */
export async function initDB(prisma: PrismaService): Promise<void> {
  try {
    await initRoles(prisma);
    await initPositions(prisma);
    await initSubjects(prisma);
    await initJSQuestions(prisma);
    await initEmbededQuestions(prisma);
    await initAdmins(prisma);
  } catch (error) {
    const { message, status } = getErrorMessageAndStatus(error);
    throw new HttpException(message, status);
  }
}
