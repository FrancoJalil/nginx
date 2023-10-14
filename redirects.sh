#!/bin/sh

# Redirecciones para quitar la extensión ".html"
echo "location / { return 301 /home.html; }" > /etc/nginx/conf.d/redirects.conf
echo "location /my-generations { return 301 /my-generations.html; }" >> /etc/nginx/conf.d/redirects.conf
echo "location /profile { return 301 /profile.html; }" >> /etc/nginx/conf.d/redirects.conf
# Agrega más redirecciones según tus páginas

exec "$@"
