FROM nginx:alpine

# Copia tus archivos HTML al directorio web
COPY site /usr/share/nginx/html

