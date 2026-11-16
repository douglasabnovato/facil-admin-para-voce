import { defineConfig } from '@playwright/test';

// PORT permite rodar ao lado de outro servidor local; o padrão segue 4173.
const porta = process.env.PORT || 4173;

export default defineConfig({
  testDir: 'tests',
  use: { baseURL: `http://127.0.0.1:${porta}` },
  webServer: {
    command: `npx http-server . -p ${porta} -a 127.0.0.1 -s`,
    url: `http://127.0.0.1:${porta}`,
    reuseExistingServer: false,
  },
});
