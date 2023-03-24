import * as Result from '../lib/Result';
import * as RuleVariant from './RuleVariant';

export class Parser extends Map<string, RuleVariant.RuleVariant> {
	private _rootVariant: RuleVariant.RuleVariant;

	public constructor(rootVariant: RuleVariant.RuleVariant, ruleVariants: Array<[string, RuleVariant.RuleVariant]> = []) {
		super(ruleVariants);
		this._rootVariant = rootVariant;
	}

	public static create(rootVariant: RuleVariant.RuleVariant, ruleVariants: Array<[string, RuleVariant.RuleVariant]> = []): Parser {
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