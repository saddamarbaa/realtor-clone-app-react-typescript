import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react';
import path from 'path'

export default defineConfig({
  plugins: [reactRefresh(),react()],
   server: {
    port: 3000,
  },
  resolve: {
    alias: {
     'components': path.resolve(__dirname, 'src/components'),
      'styles': path.resolve(__dirname, 'src/styles'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'screens': path.resolve(__dirname, 'src/screens'),
      'layouts': path.resolve(__dirname, 'src/layouts'),
      'constants': path.resolve(__dirname, 'src/constants'),
      'contexts': path.resolve(__dirname, 'src/contexts'),
      'hooks': path.resolve(__dirname, 'src/hooks'),
      'globalStates': path.resolve(__dirname, 'src/globalStates'),
      'services': path.resolve(__dirname, 'src/services'),
      'assets': path.resolve(__dirname, 'src/assets'),
      'config': path.resolve(__dirname, 'src/config'),
      'types': path.resolve(__dirname, 'src/types')
    }
  }
})












   
     
     
     
      
     