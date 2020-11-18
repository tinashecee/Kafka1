FROM node:10.19.0
RUN mkdir /Kafka1
ADD . /Kafka1
WORKDIR /Kafka1
RUN npm i
EXPOSE 80
CMD ["npm","run","dev"]