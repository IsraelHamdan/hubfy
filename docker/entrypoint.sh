#!/bin/sh

echo "⏳ Aguardando banco..."
sleep 5

echo "📦 Rodando migrations..."
npx prisma migrate deploy

echo "🚀 Iniciando aplicação..."
exec "$@"
