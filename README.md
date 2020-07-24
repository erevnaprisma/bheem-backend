# RAYAPAY BACKEND #

Modul untuk backend aplikasi mobile rayapay. Dibuat menggunakan Node Js.

## Keterangan file dan directori

- **bin**               = berisi script untuk startup aplikasi. Atau script yang lain yang di eksekusi pakai npm.
- **controllers**       = semua logic atau bisnis process
- **models**            = schema table atau collection. dan interface untuk berhubungan dengan database layer, termasuk elasticsearch
- **middlewares**       = logic atau bisnis process tambahan sebelum execute controllers.
- **public**            = berisi file-file static seperti image, css, js, dan lain-lain
- **views**             = berisi file html
- **app.js**            = file yang akan di execute pertama kali saat startup
- **config.js**         = berisi parameter-parameter configurasi aplikasi, seperti, koneksi database atau elasticsearch
- **bootstrap.js**  = file yang akan di execute dari file app.js. file ini berguna untuk menambahkan logic-logic tambahan saat startup aplikasi.
- **package.json**  = informasi tentang aplikasi atau metadata dari aplikasi. semua daftar dependency library javascript.
## Clone 
```bash
git clone https://<username>@bitbucket.org/deX_team/rayapay-backend-njs.git
```

## Install
```bash
npm install
```

## Start Production (untuk server production)
```bash
export PRIVATE_KEY=xxx
export PRIVATE_KEY_MERCHANT=yyy
export HMAC=r4y4P4y2020
export SERIAL_NUMBER=12345
npm start
```
## Start Development (untuk server development)
```bash
export PRIVATE_KEY=xxx
export PRIVATE_KEY_MERCHANT=yyy
export HMAC=r4y4P4y2020
export SERIAL_NUMBER=12345
npm run dev
```
## Start local (untuk server di laptop masing2)
```bash
export PRIVATE_KEY=xxx
export PRIVATE_KEY_MERCHANT=yyy
export HMAC=r4y4P4y2020
export SERIAL_NUMBER=12345
npm run dev
```