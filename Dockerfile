FROM node:10.19.0
WORKDIR /Kafka1
COPY  / ./
RUN npm install 
EXPOSE 8080
CMD ["npm","run","dev"]