#!/bin/sh

echo "📦 Gerando Prisma Client..."
npx prisma generate

echo "📦 Rodando migrations..."
npx prisma migrate deploy

echo "🚀 Iniciando aplicação..."
exec "$@"
