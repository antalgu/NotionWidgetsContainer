FROM arm64v8/nginx:alpine
WORKDIR /app

COPY /widget /usr/share/nginx/html

