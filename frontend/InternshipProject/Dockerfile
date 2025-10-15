# Étape 1 : build Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Étape 2 : serveur Nginx
FROM nginx:alpine
COPY --from=build /app/dist/sakai-ng /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
