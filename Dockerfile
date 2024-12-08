FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./app/
RUN npm ci
  
RUN npm install nodemon --save-dev

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm cache clean --force \
  && npm config set registry http://registry.npmjs.org/ \
  && npm install types-registry \
  && npm install
  
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