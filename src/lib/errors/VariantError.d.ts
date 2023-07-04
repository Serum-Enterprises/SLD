export class VariantError extends Error {
    // Create a new VariantError Instance
    constructor(message: string, index: number);

    // Getters for all Properties
    get index(): number;
}
