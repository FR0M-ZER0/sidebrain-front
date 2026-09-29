# Stage 1: Build da aplicacao React
FROM node:20-alpine AS builder

WORKDIR /app

# Instala as dependencias com npm ci
COPY package*.json ./
RUN npm ci

# Copia o codigo fonte e gera a build de producao
COPY . .
RUN npm run build

# Stage 2: Servidor Nginx para SPA
FROM nginx:alpine AS runner

# Copia arquivos estaticos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia a configuracao do Nginx com suporte a SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
