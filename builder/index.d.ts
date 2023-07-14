interface ComponentInterface {
	type: 'STRING' | 'REGEXP' | 'VARIANT';
	value: string;
	name: string | null;
	greedy: boolean;
	optional: boolean;
}

interface RuleInterface {
	components: ComponentInterface[];
	throwMessage: string | null;
	recoverComponent: ComponentInterface | null;
}

interface VariantInterface extends Array<RuleInterface> { }
interface GrammarInterface {
	[key: string]: VariantInterface;
}

class Grammar extends Map<string, Variant> {
	static create(variants: { [key: string]: Variant } = {}): Grammar;
	constructor(variants: { [key: string]: Variant } = {});

	toJSON(): GrammarInterface;

	set(key: string, value: Variant): Grammar;
}

class Variant extends Set<Rule> {
	static create(rules: Array<Rule> = []): Variant;

	constructor(rules: Array<Rule> = []): Variant;

	toJSON(): VariantInterface;

	add(value: Rule): Variant;
}

class Rule {
	static begin(): QuantitySelector;

	static throw(message: string): Rule;

	addComponent(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null = null, greedy: boolean = false, optional: boolean = false): Rule;

	begin(): QuantitySelector;
	recover(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string): Rule;
	throw(message: string): Rule;

	followedBy(): QuantitySelector;
	directlyFollowedBy(): QuantitySelector;

	toJSON(): RuleInterface;
}

class ComponentSelector {
	constructor(ruleInstance: Rule, greedy: boolean = false, optional: boolean = false);

	string(string: string, name: string | null = null): Rule;
	regexp(regexp: RegExp, name: string | null = null): Rule;
	variant(variant: string, name: string | null = null): Rule;
}

class QuantitySelector {
	constructor(ruleInstance: Rule);

	one(): ComponentSelector;
	zeroOrOne(): ComponentSelector;
	zeroOrMore(): ComponentSelector;
	oneOrMore(): ComponentSelector;
}

export { Grammar, Variant, Rule };