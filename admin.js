const {Kafka} = require('kafkajs');
run();
async function  run(){
    try{
           const kafka = new Kafka({
               clientId:'myapp',
               brokers: ['localhost:19092','localhost:29092','localhost:39092']
           })
           const admin = kafka.admin();
           console.log('Connecting....')
           await admin.connect()
           console.log('Connected!')
           //let a = await admin.fetchTopicOffsets('testTopicAgain');
           let topic = 'testTopicAgain'
           let groupId = 'group1'
           let timestamp = '1604866688901'
           //await admin.resetOffsets({ groupId, topic });
           //let a = await admin.fetchTopicOffsetsByTimestamp(topic, timestamp)
           let a = await admin.fetchTopicOffsets('testTopicAgain');
           console.log(a);
           await admin.disconnect();
    }
    catch(ex){
        console.log('Something went wrong'+ex);
    }
    finally{
        process.exit(0);
    }
}