/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { parse } from 'dotenv';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

const envFilePath = resolve(__dirname, '.env');
const envConfig = parse(readFileSync(envFilePath));
const envLocalFilePath = resolve(__dirname, '.env.local');
const envLocalConfig = parse(readFileSync(envLocalFilePath));

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), tsconfigPaths(), checker({ typescript: true })],
  publicDir: resolve(__dirname, 'src/assets'),
  define: {
    'process.env': { ...envConfig, ...envLocalConfig },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      // always throw with build warnings
      onwarn(warning, warn) {
        // @ts-ignore
        warn('\nBuild warning happened, customize "onwarn" callback in vite.config.ts to handle this error.');
        // @ts-ignore
        throw new Error(warning);
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
