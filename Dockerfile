FROM node:16-alpine as base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:server && npm run build

FROM node:16-alpine as runner
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=base /usr/src/app/dist/ /usr/src/app/dist/
COPY --from=base /usr/src/app/build/ /usr/src/app/build/
EXPOSE 8080
CMD ["npm", "run", "start:server"]