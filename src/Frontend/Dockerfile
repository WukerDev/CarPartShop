FROM node:22-alpine AS build
WORKDIR /app

COPY src/Frontend/package*.json ./
RUN npm ci

COPY src/Frontend/ ./
RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html/portal
COPY --from=build /app/dist /usr/share/nginx/html
COPY src/Frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
