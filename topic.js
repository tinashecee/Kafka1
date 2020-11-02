const {Kafka} = require('kafkajs');
run();
async function  run(){
    try{
           const kafka = new Kafka({
               'clientId':'myapp',
               'brokers': ['localhost:19092','localhost:29092','localhost:39092']
           })
           const admin = kafka.admin();
           console.log('Connecting....')
           await admin.connect()
           console.log('Connected!')
           await admin.createTopics({
               'topics': [{
                   'topic':'testTopicAgain',
                   'numPartitions':1
               }]
           })
           console.log('Created Successfully')
           await admin.disconnect();
    }
    catch(ex){
        console.log('Something went wrong'+ex);
    }
    finally{
        process.exit(0);
    }
}