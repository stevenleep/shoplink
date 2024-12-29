FROM node:23-alpine

RUN npm install -g pnpm
RUN pnpm set registry https://registry.npm.taobao.org
RUN pnpm set store-dir ~/.pnpm-store
RUN pnpm set fetch-retries 3
RUN pnpm set fetch-timeout 60000
RUN pnpm set fetch-concurrency 20
RUN pnpm set network-concurrency 20

# Create app directory
WORKDIR /app

COPY . .

# Install app dependencies
RUN pnpm install

# Bundle app source
RUN pnpm run build

EXPOSE 3000

CMD [ "pnpm", "start" ]