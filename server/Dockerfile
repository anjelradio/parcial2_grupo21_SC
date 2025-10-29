# ================================
# Etapa 1: PHP + Composer + extensiones
# ================================
FROM php:8.3-fpm-alpine AS build

# Instalar dependencias necesarias para Laravel y PostgreSQL
RUN apk add --no-cache git unzip libpq-dev oniguruma-dev icu-dev shadow supervisor nginx bash \
    && docker-php-ext-install pdo pdo_pgsql intl opcache

# Copiar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar todo el proyecto Laravel al contenedor
COPY . .

# Instalar dependencias PHP (sin ejecutar scripts post-install)
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Ejecutar scripts artisan manualmente una vez todo está en su lugar
RUN php artisan config:clear && php artisan route:clear && php artisan view:clear || true

# ================================
# Etapa 2: Imagen final de ejecución
# ================================
FROM php:8.3-fpm-alpine

RUN apk add --no-cache nginx bash supervisor

# Copiar PHP y Nginx desde la imagen anterior
COPY --from=build /usr/local/bin/php /usr/local/bin/php
COPY --from=build /usr/local/sbin/php-fpm /usr/local/sbin/php-fpm
COPY --from=build /usr/local/etc/php/ /usr/local/etc/php/
COPY --from=build /usr/local/etc/php-fpm.d/ /usr/local/etc/php-fpm.d/
COPY --from=build /var/www/html /var/www/html

# Copiar configuraciones
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf

# Puerto Cloud Run
EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
