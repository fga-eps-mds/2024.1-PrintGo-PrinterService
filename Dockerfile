FROM node:18

WORKDIR /src

ENV PORT=8001
ARG DATABASE_URL

COPY ./package.json .
RUN yarn install

COPY . .

EXPOSE $PORT

RUN npx prisma generate
RUN npx prisma db push

CMD [ "yarn", "start" ]