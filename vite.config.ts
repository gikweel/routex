import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin, loadEnv } from 'vite';
import { handleApiRoute } from './src/server/apiMiddleware';

function apiServerPlugin(): Plugin {
  return {
    name: 'routex-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handleApiRoute(req, res);
          if (!handled) next();
        } catch (err) {
          console.error('[API Middleware Error]:', err);
          next(err);
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Ensure GEMINI_API_KEY from .env is available to the Node middleware
  const env = loadEnv(mode, process.cwd(), '');
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v;
  }

  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
