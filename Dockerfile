FROM node:22 AS base

WORKDIR /app

COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  fi
  
RUN npm install nodemon --save-dev

FROM base AS builder
WORKDIR /app
RUN npm install
COPY . .
  
COPY .env .env
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=development

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/ ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 4000

ENV PORT=4000

CMD ["npm", "run", "dev"]