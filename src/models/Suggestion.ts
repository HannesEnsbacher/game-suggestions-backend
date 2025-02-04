export class Suggestion {
    name: string;
    release_year: number;
    reasoning: string;

    constructor(data: any) {
        this.name = data.name;
        this.release_year = data.release_year;
        this.reasoning = data.reasoning;
    }
}
