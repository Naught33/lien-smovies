import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        explore: resolve(__dirname, 'explore.html'),
        account: resolve(__dirname, 'account.html'),
        blogread: resolve(__dirname, 'blogread.html'),
        loginsignup: resolve(__dirname, 'loginsignup.html'),
        allblogs: resolve(__dirname, 'admin/allblogs.html'),
        writeblog: resolve(__dirname, 'admin/writeblog.html')
      }
    }
  }
})