import { sign } from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DateFilter, ErrorMessage } from '../enum/enum';
import { Config } from '../config/config';

export interface ExcelRequiredFields {
  FirstName: string;
  LastName: string;
  Email: string;
  Mobile: string | number;
  DOB: string | number | Date;
  College: string;
  Degree: string;
  Specialization: string;
}

/**
 * @function generateToken
 * @description Generate a JWT token for a user.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<string>} The generated JWT token.
 */
export async function generateToken(userId: number): Promise<string> {
  try {
    const tokenValidity = {
      expiresIn: '1d',
    };
    // Sign the user ID into a JWT token
    const token = sign({ userId }, Config.secretKey, tokenValidity);
    return token;
  } catch (error) {
    const { message, status } = getErrorMessageAndStatus(error);
    throw new HttpException(message, status);
  }
}

export interface PaginationResponse {
  from: number;
  to: number;
  total: number;
  totalPages: number;
  data: any[];
}

/**
 * @function paginationResponse
 * @description Create a pagination response.
 *
 * @param {number} page - Current page number.
 * @param {number} total - Total items.
 * @param {number} itemsPerPage - Number of items per page.
 * @param {any[]} data - Data for the current page.
 * @returns {PaginationResponse} The pagination response.
 */
export const paginationResponse = (
  page: number,
  total: number,
  itemsPerPage: number,
  data: any[],
): PaginationResponse => {
  let totalPages = Math.ceil(total / itemsPerPage);
  let from = 1,
    to = data.length;

  if (data.length == 0) {
    from = 0;
    to = 0;
    total = 0;
    totalPages = 0;
  }

  if (page > 0) {
    from = page <= totalPages ? page * itemsPerPage - 9 : 1;
    to = from + 9 > total ? total : from + 9;
    total > 0 ? from : (from = 0);
  }

  return {
    from,
    to,
    total,
    totalPages,
    data,
  };
};

/**
 * @function getErrorMessageAndStatus
 * @description Get error message and status from an error object.
 *
 * @param {any} error - The error object.
 * @returns {{message: string, status: number}} The error message and status.
 */
export function getErrorMessageAndStatus(error: any): {
  message: string;
  status: number;
} {
  const message = error?.message ?? ErrorMessage.SomethingWentWrong;
  const status = error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
  return { message, status };
}

export interface DateFilterResponse {
  gte?: string | Date;
  lte?: string | Date;
}

/**
 * @function dateFilterResponse
 * @description Generate a date filter response based on user input.
 *
 * @param {DateFilter} dateFilter - The selected date filter.
 * @param {string} startDate - The start date.
 * @param {string} endDate - The end date.
 * @returns {DateFilterResponse} The date filter response.
 */
export const dateFilterResponse = (
  dateFilter: DateFilter,
  startDate: string,
  endDate: string,
): DateFilterResponse => {
  let dateFilterRes: DateFilterResponse;
  if (dateFilter == DateFilter.Today) {
    dateFilterRes = {
      gte: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
      lte: new Date().toISOString().split('T')[0] + 'T23:59:59.000Z',
    };
  } else if (dateFilter == DateFilter.Yesterday) {
    dateFilterRes = {
      gte:
        new Date(new Date().setDate(new Date().getDate() - 1))
          .toISOString()
          .split('T')[0] + 'T00:00:00.000Z',
      lte:
        new Date(new Date().setDate(new Date().getDate() - 1))
          .toISOString()
          .split('T')[0] + 'T23:59:59.000Z',
    };
  } else if (dateFilter == DateFilter.DateRange) {
    dateFilterRes = {
      gte: startDate + 'T00:00:00.000Z',
      lte: endDate + 'T23:59:59.000Z',
    };
  } else if (dateFilter == DateFilter.MonthTillDate) {
    const date = new Date();
    date.setDate(1);
    dateFilterRes = {
      gte: date.toISOString().split('T')[0] + 'T00:00:00.000Z',
    };
  } else if (dateFilter == DateFilter.All) {
    dateFilterRes = {
      lte: new Date(),
    };
  }

  return dateFilterRes;
};
