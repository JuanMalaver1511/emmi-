FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Railway inyecta las variables del servicio como build args.
# VITE_API_URL debe apuntar a la URL pública del backend.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Se copia como template: el entrypoint de nginx sustituye ${PORT} al arrancar.
COPY nginx.conf /etc/nginx/templates/default.conf.template
# Valor por defecto; Railway lo sobrescribe en runtime con su propio PORT.
ENV PORT=80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
