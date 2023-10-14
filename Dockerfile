FROM nginx:alpine

# Copia tus archivos HTML al directorio web
COPY site /usr/share/nginx/html

# Copia el archivo de configuración personalizado
COPY nginx.conf /etc/nginx/conf.d/
