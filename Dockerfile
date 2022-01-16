FROM node:16 as base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:server && npm run build

FROM node:16 as runner
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=base /usr/src/app/dist/app.js /usr/src/app/dist/app.js
COPY --from=base /usr/src/app/build/ /usr/src/app/build/
EXPOSE 8080
CMD ["npm", "run", "start:server"]