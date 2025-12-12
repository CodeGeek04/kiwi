FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./
RUN apk add --no-cache libc6-compat openssl

# Install dependencies
RUN npm i -g pnpm
RUN pnpm i

# Copy app files
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm prisma generate
RUN npm run build

# Production
ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "start"]
