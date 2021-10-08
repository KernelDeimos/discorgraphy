const MY_NAME = 'tools/generate.js';

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const PROJECT_ROOT = path.join(__dirname, '..');
const IGNORE_LIST = ['node_modules', '.git'];

const generators = [];

// GENERATE types.ts
generators.push({
    scope: 'bindings',
    fn: (path, bindings) => {
        let types = bindings.map(v => v.symbol)
        let src = `// GENERATED by ${MY_NAME}\n`;
        src += `export const TYPES = {\n` + (types || [])
            .map(v => `    ${v}: Symbol('${v}'),`)
            .join('\n') + '\n};\n';
        return [
            ['types.ts', src],
        ];
    },
});

// GENERATE inversify.config.ts
generators.push({
    scope: 'bindings',
    fn: (path, bindings) => {
        let types = bindings.map(v => v.symbol)
        let src = `// GENERATED by ${MY_NAME}\n`;

        src += [
            `import { Container } from "inversify";`,
            `import { TYPES } from "./types";`,
        ].join('\n') + '\n';
        src += '\n';

        for ( let binding of bindings ) {
            src += `import { ${binding.symbol} } from "${binding.module}";\n`
        }
        src += '\n';

        src += 'const container = new Container();\n';
        src += '\n';

        for ( let binding of bindings ) {
            // TODO: allow interfaces here
            src += `container.bind<${binding.symbol}>(TYPES.${binding.symbol}).to(${binding.symbol});\n`
        }
        src += '\n';

        src += [
            `export { container };`
        ].join('\n') + '\n';

        return [
            ['inversify.config.ts', src],
        ];
    },
});

async function* walk(dir, searchFile) {
    for await ( const node of await fs.promises.opendir(dir) ) {
        const fullPath = path.join(dir, node.name);
        if ( node.isDirectory() && ! IGNORE_LIST.includes(node.name) ) {
            yield* walk(fullPath, searchFile);
        }
        else if ( node.isFile() && node.name == searchFile ) {
            yield dir;
        }
    }
}

async function main() {
    for await (const p of walk(PROJECT_ROOT, 'models.yml')) {
        let ymlSource = await fs.promises.readFile(path.join(p, 'models.yml'));
        let models = yaml.parse(ymlSource.toString('utf-8'));

        for ( let generator of generators ) {
            // ???: dotted scope support
            if ( ! models[generator.scope] ) continue;

            let data = models[generator.scope];
            console.log('models', `[${generator.scope}] =`, data)
            let outFiles = generator.fn(p, data);
            for ( let outFile of outFiles ) {
                await fs.promises.writeFile(
                    path.join(p, outFile[0]),
                    outFile[1],
                )
            }
        }

    }
}

main();