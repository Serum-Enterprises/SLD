import { Option, Some, None } from './Option';
import { Node } from './Node';

import type { Grammar } from '../Grammar';

export { Result, Ok, Err } from './Result';
export { panic } from './panic';
export { Node, Option, Some, None };

export type ParseError = { message: string, location: number, stack: { source: string, precedingNode: Option<Node>, grammarContext: Grammar }[] };