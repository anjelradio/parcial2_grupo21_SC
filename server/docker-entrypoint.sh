#!/bin/bash
set -e

echo "🧹 Limpiando cachés de Laravel..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "✅ Cachés limpiados"

echo "🚀 Iniciando servicios con Supervisor..."
exec /usr/bin/supervisord -c /etc/supervisord.conf