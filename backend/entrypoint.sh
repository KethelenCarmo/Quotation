#!/bin/sh

set -e

echo "Aplicando migrações do banco de dados..."
python manage.py migrate --noinput

exec "$@"