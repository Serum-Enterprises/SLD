import { BaseComponentInterface } from './BaseComponent';
import { ComponentSetInterface } from './ComponentSet';

export interface RuleInterface {
	components: ComponentSetInterface[];
	throwMessage: string | null;
	recoverComponent: BaseComponentInterface | null;
}