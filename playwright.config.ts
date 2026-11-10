import {defineConfig} from '@playwright/test';
const repo=process.env.GITHUB_REPOSITORY?.split('/')[1];
const base=process.env.BASE_PATH||(repo&&!repo.endsWith('.github.io')?`/${repo}/`:'/');
export default defineConfig({testDir:'tests/e2e',use:{launchOptions:{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH},baseURL:`http://127.0.0.1:4173${base}`,viewport:{width:390,height:844},isMobile:true,hasTouch:true},webServer:{command:'npm run preview -- --port 4173',url:`http://127.0.0.1:4173${base}`,reuseExistingServer:!process.env.CI},projects:[{name:'chromium',use:{browserName:'chromium'}}]});
