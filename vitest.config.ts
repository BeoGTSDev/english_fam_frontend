import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: [
        'src/App.tsx',
        'src/features/auth/api/auth-api.ts',
        'src/features/auth/hooks/useAuthSession.ts',
        'src/shared/api/api-client.ts',
      ],
      reporter: ['text', 'json-summary'],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80,
      },
    },
  },
})
