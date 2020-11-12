const { Kafka } = require('kafkajs')
const messages = require('./input.json')


const client = new Kafka({
    'clientId':'myapp',
    'brokers': ['localhost:19092','localhost:29092','localhost:39092']
})

const topic = 'testQueue5'

const producer = client.producer()

let i = 0


async function sendToKafka(input) {
  await producer.connect()


    payloads = { 
      topic: topic,
      messages: [
        { key: 'queue', value: JSON.stringify(input) }
      ]
    }
    console.log('payloads=', payloads)
    producer.send(payloads)
    
}

async function saveToCache(){

}
//sendMessage(producer, topic)
module.exports = sendToKafka;