const topic = "cjji8do7-default" 
// set the correct topic name, especially when you are using CloudKarafka 
const kafkaConfig = { 
// Specify the endpoints of the CloudKarafka Servers for your instance found under Connection Details on the Instance Details Page 
// this looks like this: moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094" 
"metadata.broker.list": "tricycle-01.srvs.cloudkafka.com:9094,tricycle-02.srvs.cloudkafka.com:9094,tricycle-03.srvs.cloudkafka.com:9094" ,
 "security.protocol": "SASL_SSL",
 "sasl.mechanisms": "SCRAM-SHA-256",
 "sasl.username": "cjji8do7",
 "sasl.password": "KxR8Sd-DMNqjvS04kGHaEQYa1SG0nQY8" 
}; module.exports = { kafkaConfig, topic };