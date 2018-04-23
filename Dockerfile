FROM node:8.9-alpine
WORKDIR home
COPY src .
EXPOSE 3000
CMD npm start
