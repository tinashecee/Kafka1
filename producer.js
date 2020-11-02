const { Kafka } = require('kafkajs')
const messages = require('./input.json')

const client = new Kafka({
    'clientId':'myapp',
    'brokers': ['localhost:19092','localhost:29092','localhost:39092']
})

const topic = 'testTopicAgain'

const producer = client.producer()

let i = 0

const sendMessage = async (producer, topic) => {
  await producer.connect()

  setInterval(function() {
    i = i >= messages.length - 1 ? 0 : i + 1
    payloads = {
      topic: topic,
      messages: [
        { key: 'coronavirus-alert', value: JSON.stringify(messages[i]) }
      ]
    }
    console.log('payloads=', payloads)
    producer.send(payloads)
  }, 5000)
}

sendMessage(producer, topic)