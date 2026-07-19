import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import fs from 'node:fs'

const DATA_DIR = path.resolve(__dirname, 'src/data/chip_pdf')

// 自定义插件：开发模式下服务 /data/chip_pdf/ 路径，构建时复制 PDF 到 dist/data/chip_pdf/
function serveDataDir() {
  return {
    name: 'serve-data-dir',
    configureServer(server) {
      server.middlewares.use('/data/chip_pdf', (req, res) => {
        const filePath = path.join(DATA_DIR, req.url.split('?')[0])
        if (fs.existsSync(filePath)) {
          const ext = path.extname(filePath).toLowerCase()
          const mimeTypes = {
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml',
          }
          res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
          fs.createReadStream(filePath).pipe(res)
        } else {
          res.statusCode = 404
          res.end('Not found')
        }
      })
    },
    closeBundle() {
      // 构建后复制 PDF 文件到 dist/data/chip_pdf/
      const distDataDir = path.resolve(__dirname, 'dist/data/chip_pdf')
      if (fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(distDataDir, { recursive: true })
        const pdfFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.pdf'))
        for (const file of pdfFiles) {
          fs.copyFileSync(path.join(DATA_DIR, file), path.join(distDataDir, file))
        }
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), serveDataDir()],
})
