FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY src ./src
COPY tsconfig.json .
RUN npm run build

ENV PORT=4005
EXPOSE 4005

CMD ["npm", "start"]
