import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: 'lib/react.ts',
        output: {
            file: 'dist/react.js',
            format: 'iife',
            name: 'React'
        },
        plugins: [
            nodeResolve(),
            typescript({ tsconfig: './tsconfig-build.json' }) // Specify the config file here
        ]
    },
    {
        input: 'lib/react.ts',
        output: {
            file: 'dist/react.d.ts',
            format: 'es'
        },
        plugins: [
            dts({ tsconfig: './tsconfig-build.json' }) // Also specify it for declarations
        ]
    }
];
