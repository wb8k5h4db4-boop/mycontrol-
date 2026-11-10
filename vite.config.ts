import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';
export default defineConfig({base:process.env.BASE_PATH || './',plugins:[react(),VitePWA({registerType:'prompt',includeAssets:['apple-touch-icon.png','icon-192.png','icon-512.png'],manifest:{name:'MyControl — личный диспетчер',short_name:'MyControl',description:'Задачи и календарь. Данные только на устройстве.',lang:'ru',start_url:'.',scope:'.',display:'standalone',background_color:'#f5f6fa',theme_color:'#6558e8',icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'}]},workbox:{globPatterns:['**/*.{js,css,html,png,svg,ico,woff2}'],navigateFallback:'index.html',cleanupOutdatedCaches:true}})]});
