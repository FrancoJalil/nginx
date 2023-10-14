#!/bin/sh

# Crea un archivo de configuración de redirecciones vacío
> /etc/nginx/conf.d/redirects.conf

# Agrega redirecciones utilizando las variables de entorno
echo "location $PAGE1_PATH { return 301 $PAGE1_PATH.html; }" >> /etc/nginx/conf.d/redirects.conf
echo "location $PAGE2_PATH { return 301 $PAGE2_PATH.html; }" >> /etc/nginx/conf.d/redirects.conf
# Agrega más redirecciones utilizando variables de entorno

exec "$@"
