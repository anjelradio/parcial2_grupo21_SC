# ================================
# Etapa 1: PHP + Composer + extensiones
# ================================
FROM php:8.3-fpm-alpine AS build

# Instalar dependencias necesarias para Laravel y PostgreSQL
RUN apk add --no-cache git unzip libpq-dev oniguruma-dev icu-dev shadow bash \
    && docker-php-ext-install pdo pdo_pgsql intl opcache mbstring exif

# Copiar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar el código fuente de Laravel
COPY . .

# Instalar dependencias PHP (sin dev)
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# ⚠️ NO CACHEES AQUÍ - Las configs dependen de variables de entorno de Cloud Run
# RUN php artisan config:cache && php artisan route:cache  ← ELIMINAR ESTO

# Limpiar cualquier cache existente
RUN php artisan config:clear || true
RUN php artisan cache:clear || true
RUN php artisan route:clear || true
RUN php artisan view:clear || true
RUN rm -rf bootstrap/cache/*.php

# ================================
# Etapa 2: Imagen final de ejecución
# ================================
FROM php:8.3-fpm-alpine

# Instalar dependencias de runtime y extensiones requeridas
RUN apk add --no-cache nginx bash supervisor libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql opcache

WORKDIR /var/www/html

# Copiar el proyecto desde la etapa build
COPY --from=build /var/www/html /var/www/html

# Copiar configuraciones
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf

# Copiar y dar permisos al entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8080

# Usar el entrypoint que limpia cachés antes de iniciar supervisord
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]