import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from "path"
// @ts-ignore
import dotenv from "dotenv";
let envPath = '.env';

if (typeof process.env.NODE_ENV === 'string' && process.env.NODE_ENV !== 'development') {
  envPath = `.env.${process.env.NODE_ENV}`;
}

dotenv.config({ path: resolve(process.cwd(), envPath)});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: resolve(process.env.BUILD_DIR),
  }
})
