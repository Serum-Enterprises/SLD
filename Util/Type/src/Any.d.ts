declare class AnyType {
	/**
	 * Set a custom constraint function on this type
	 */
	constraint(fn: (value: unknown, varName?: string) => void): this;

	/**
	 * Validate a value against this type
	 */
	validate(value: unknown, varName?: string): asserts value is unknown;
}

export { AnyType };