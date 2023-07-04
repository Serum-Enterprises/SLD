export class AutoThrowError extends Error {
    // Create a new AutoThrowError Instance
    constructor(message: string, index: number);

    // Getters for all Properties
    get index(): number;
}
