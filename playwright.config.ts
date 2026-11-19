import {defineConfig} from '@playwright/test'

export default defineConfig({
  testDir:'./tests',
  use:{
    baseURL:'http://127.0.0.1:4321',
    launchOptions:{executablePath:process.env.RY_CHROMIUM_PATH},
  },
  webServer:{command:'npm run preview',url:'http://127.0.0.1:4321/en/',reuseExistingServer:true},
})
