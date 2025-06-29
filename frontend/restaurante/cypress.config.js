import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // ou o endereço do Vite
    setupNodeEvents() {
      // pode deixar vazio se não usar eventos
    },
  },
})
