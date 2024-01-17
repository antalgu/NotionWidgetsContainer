FROM arm64v8/nginx:alpine
WORKDIR /app

COPY /Widget /usr/share/nginx/html

