# ---------- Base ----------
FROM node:20.19.6-alpine AS base
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Build ----------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma Client
RUN npx prisma db push
RUN npx prisma generate


# Next build (prod)
RUN npm run build

# ---------- Runtime ----------
FROM node:20.19.6-alpine AS runner
WORKDIR /app

# Copiando apenas o necessário
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# EntryPoint para migrations
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "start"]
