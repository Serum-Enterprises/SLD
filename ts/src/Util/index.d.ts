export { Result, Ok, Err } from './Result';
export { Option, Some, None } from './Option';
export { Node } from './Node';

export function panic(message: string): never;
export type ParseError = { message: string, location: number, stack: { source: string, precedingNode: Option<Node>, grammarContext: Grammar }[] };