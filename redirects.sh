#!/bin/sh

# Crea un archivo de configuración de redirecciones vacío
> /etc/nginx/conf.d/redirects.conf

# Agrega redirecciones para quitar la extensión ".html"
echo "location /my-generations { return 301 /my-generations.html; }" >> /etc/nginx/conf.d/redirects.conf
echo "location /profile { return 301 /profile.html; }" >> /etc/nginx/conf.d/redirects.conf
# Agrega más redirecciones según tus páginas

exec "$@"
