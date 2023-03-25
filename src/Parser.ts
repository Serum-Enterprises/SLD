import * as Result from '../lib/Result';
import * as RuleVariant from './Variant';

export class Parser extends Map<string, RuleVariant.Variant> {
	private _rootVariant: RuleVariant.Variant;

	public constructor(rootVariant: RuleVariant.Variant, ruleVariants: Array<[string, RuleVariant.Variant]> = []) {
		super(ruleVariants);
		this._rootVariant = rootVariant;
	}

	public static create(rootVariant: RuleVariant.Variant, ruleVariants: Array<[string, RuleVariant.Variant]> = []): Parser {
		return new Parser(rootVariant, ruleVariants);
	}

	public parse(input: string, showMeta: boolean = false): Result.Result {
		let result: Result.Result;

		if (showMeta)
			result = this._rootVariant.execute(input, null, this);
		else
			result = JSON.parse(JSON.stringify(this._rootVariant.execute(input, null, this)), (key: string, value: any) => key === 'meta' ? undefined : value);

		return result;
	}
}