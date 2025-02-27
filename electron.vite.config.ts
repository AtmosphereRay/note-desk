import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import conf from "./config/default.json";
import pkg from './package.json';
import electron from 'vite-plugin-electron'
import { wrapperEnv } from "./build/getEnv";
import { loadEnv } from "vite";

const root = process.cwd();
const isBuild = process.argv.slice(2).includes('build')
const env = loadEnv(isBuild ? "production" : "development", root);
const viteEnv = wrapperEnv(env);

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      electron([
        {
          entry: './src/main/worker/worker.ts',
          onstart(options) { options.startup() },
          vite: {
            build: {
              sourcemap: false,
              outDir: './out/main',
              rollupOptions: {
                external: Object.keys(pkg.dependencies),
              },
            },
          }
        }
      ])
    ],
    resolve: {
      alias: {
        "@conf": resolve("config"),
        "~": resolve("./")
      }
    },
    build: {
      rollupOptions: {
        external: Object.keys(pkg.devDependencies),
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        "@conf": resolve("config"),
        "~": resolve("./")
      }
    },
    plugins: [externalizeDepsPlugin(), electron([{

      // apply:"serve",
      entry: './src/preload/webview.ts',
      onstart: (options) => {
        options.startup();
        options.reload();
      },
      vite: {
        build: {
          sourcemap: false,
          outDir: './out/preload',
          rollupOptions: {
            external: Object.keys(pkg.dependencies),
          },
        },
      }
    }])],
    build: {
      rollupOptions: {
        external: Object.keys(pkg.devDependencies),
      }
    }

  },
  renderer: {
    base: viteEnv.VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        "@": resolve("src/renderer/src"),
        "~": resolve("./"),
        '@renderer': resolve('src/renderer/src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    server: {
      port: conf.port,
      host: "0.0.0.0"
    },
    plugins: [react()],
    // build: {
    //   rollupOptions: {
    //     external: Object.keys(pkg.devDependencies),
    //   }
    // }

  }
})
