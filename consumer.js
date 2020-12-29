const { Kafka } = require('kafkajs')
const redis = require('redis');
const kafka = new Kafka({
    'clientId':'myapp',
    'brokers': ['localhost:19092','localhost:29092','localhost:39092']
})
//create Redis client
let client = redis.createClient({
  port      : 6379,               // replace with your port
  host      : 'rdb',
});
const topic = 'testQueue2'
const consumer = kafka.consumer({
  groupId: 'group2'
})

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const jsonObj = JSON.parse(message.value.toString())
        const id = jsonObj.id;
        const name = jsonObj.name;
        const timestamp = JSON.parse(message.timestamp.toString())
        const offset = JSON.parse(message.offset.toString())
     /*   let passengerInfo = filterPassengerInfo(jsonObj)
        if (passengerInfo) {
          console.log(
            '******* Alert!!!!! passengerInfo *********',
            passengerInfo
          )
        }*/
        console.log(id,timestamp, offset);
        await client.hmset(id, [
          'timestamp', timestamp,
          'name', name,
          'offset', offset
      ], function(err, reply){
          if(err){
              console.log(err);
          }
          console.log(reply);
          
      });
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