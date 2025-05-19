# ---- Backend Dockerfile ----
FROM node:20-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install --omit=dev

# Uygulama dosyalarını kopyala
COPY . .

# Varsayılan portu belirt
EXPOSE 4000

# Ortam değişkenlerini örnek dosyadan oluşturmak için (geliştiriciye not)
# ENV NODE_ENV=production

# Uygulamayı başlat
CMD ["npm", "start"]
