import { BaseComponentInterface } from "./BaseComponent";

export interface ComponentSetInterface {
	components: BaseComponentInterface[];
	greedy: boolean;
	optional: boolean;
}