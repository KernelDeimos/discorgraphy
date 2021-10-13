import { inject, injectable } from "inversify";
import * as jsyaml from "js-yaml";
import * as fs from 'fs';
import * as filepath from 'path';
import { TYPES } from "../types"

@injectable()
export class TokenService {
    private filename: string
    constructor(
        @inject(TYPES.TokensFile) filename: string
    ) {
        this.filename = filename;
    }
    async get(name: string): Promise<string> {
        let data = await fs.promises.readFile(filepath.join(process.cwd(), this.filename));
        let obj = jsyaml.load(data.toString('utf-8'));
        return (obj as any)[name] as string;
    }
}