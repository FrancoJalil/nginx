FROM nginx:alpine

# Copia tus archivos HTML al directorio web
COPY site /usr/share/nginx/html

# Copia el script de redirecciones y establece permisos de ejecución
COPY redirects.sh /usr/share/nginx/html/redirects.sh
RUN chmod +x /usr/share/nginx/html/redirects.sh

# Ejecuta el script antes de iniciar Nginx
CMD ["/usr/share/nginx/html/redirects.sh", "nginx", "-g", "daemon off;"]
