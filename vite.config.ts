import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { handleApiRoute } from './src/server/apiMiddleware';

function apiServerPlugin(): Plugin {
  return {
    name: 'geopulse-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handleApiRoute(req, res);
          if (!handled) {
            next();
          }
        } catch (err) {
          console.error('[API Middleware Error]:', err);
          next(err);
        }
      });
    },
  };
}

export default defineConfig(() => {
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
