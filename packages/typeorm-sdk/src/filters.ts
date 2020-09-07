// Library
import {
  MoreThan,
  MoreThanOrEqual,
  LessThan,
  LessThanOrEqual,
  FindOperator,
} from 'typeorm';
import moment from 'moment';

function format(date: Date): string {
  return moment(date).toISOString();
}

export function MoreThanDate(date: Date): FindOperator<string> {
  return MoreThan(format(date));
}

export function MoreThanOrEqualDate(date: Date): FindOperator<string> {
  return MoreThanOrEqual(format(date));
}

export function LessThanDate(date: Date): FindOperator<string> {
  return LessThan(format(date));
}

export function LessThanOrEqualDate(date: Date): FindOperator<string> {
  return LessThanOrEqual(format(date));
}

export {
  In,
} from 'typeorm';
