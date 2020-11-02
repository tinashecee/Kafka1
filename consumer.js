const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    'clientId':'myapp',
    'brokers': ['localhost:19092','localhost:29092','localhost:39092']
})

const topic = 'testTopicAgain'
const consumer = kafka.consumer({
  groupId: 'group1'
})

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const jsonObj = JSON.parse(message.value.toString())
        let passengerInfo = filterPassengerInfo(jsonObj)
        if (passengerInfo) {
          console.log(
            '******* Alert!!!!! passengerInfo *********',
            passengerInfo
          )
        }
      } catch (error) {
        console.log('err=', error)
      }
    }
  })
}

function filterPassengerInfo(jsonObj) {
  let returnVal = null

  console.log(`eventId ${jsonObj.eventId} received!`)

  if (jsonObj.bodyTemperature >= 36.9 && jsonObj.overseasTravelHistory) {
    returnVal = jsonObj
  }

  return returnVal
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})

module.exports = {
  filterPassengerInfo
}