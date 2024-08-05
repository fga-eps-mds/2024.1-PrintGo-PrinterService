FROM node:18

WORKDIR /src

ENV PORT=8001

COPY ./package.json .
RUN yarn install

COPY . .

EXPOSE $PORT

RUN npx prisma generate
RUN npx prisma db push

# RUN npx prisma migrate dev --name init
CMD [ "yarn", "start" ]
