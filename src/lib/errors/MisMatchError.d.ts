export class MisMatchError extends Error {
    // Create a new MisMatchError Instance
    constructor(message: string, index: number);

    // Getters for all Properties
    get index(): number;
}
