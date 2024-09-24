export enum Role {
  SuperAdmin = 1,
  Admin = 2,
  User = 3,
}

export enum ErrorMessage {
  SomethingWentWrong = 'Something went wrong',
  NotAExistingUser = 'Not a existing user',
  PasswordMismatch = 'Password mismatch. Double-check and try again',
  EmailAlreadyExist = 'Email already exist',
  MobileAlreadyExist = 'Mobile number already exist',
}

export enum PercentageFilter {
  All = 'All',
  LessThanOrEqualTo50 = '0-50',
  GreaterThanOrEqualTo50AndLesserThanOrEqualTo75 = '50-75',
  GreaterThanOrEqualTo75 = '75-100',
}

export enum DateFilter {
  All = 'All',
  Today = 'Today',
  Yesterday = 'Yesterday',
  MonthTillDate = 'MonthTillDate',
  DateRange = 'DateRange',
}

export enum Subject {
  JavaScript = 1,
  Embedded = 2,
}

export enum ExperienceLevel {
  All = 0,
  Fresher = 1,
  Experience = 2,
}
