FROM node:18

WORKDIR /src

ENV PORT=8001
# Pega a variável de ambiente DATABASE_URL do ambiente de execução
ENV DATABASE_URL=$DATABASE_URL

COPY ./package.json .
RUN yarn install

COPY . .

EXPOSE $PORT

RUN npx prisma generate
RUN npx prisma db push

# RUN npx prisma migrate dev --name init
CMD [ "yarn", "start" ]
