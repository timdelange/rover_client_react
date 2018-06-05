import PODapi from '../../../imports/api/api_pod';
import async from 'async';


const tasks = [];
const context = {};
const roundTripDelay = 140;

tasks.push({ name: "adDoc", test: function (cb) {
  const result = {status: 'failed', errMsg: ''};
  const delivery = Deliveries.findOne();
  const p = new PODapi();
  p.setOrder(delivery, 0);
  const key = p.addDoc({});
  setTimeout(()=>{
       const delivery2 = Deliveries.findOne(delivery._id);
       p.setOrder(delivery2, 0);
       const doc = p.getDoc(key);
       if (_.isObject(doc)) {
         result.status = 'success';
         context.deliveryId=delivery2._id;
         context.docKey=key;
       }
       cb(result);
  },roundTripDelay);
}});

tasks.push({ name: "addImage", test: function (cb) {
  const result = {status: 'failed', errMsg: ''};
  const delivery = Deliveries.findOne(context.deliveryId);
  const p = new PODapi();
  p.setOrder(delivery, 0);
  const imageKey = p.addImage(context.docKey, "imageimageimageimage");
  setTimeout(()=>{
       const delivery = Deliveries.findOne(context.deliveryId);
       p.setOrder(delivery, 0);
       const image = p.getImage(context.docKey, imageKey);
       if (image  === 'imageimageimageimage') {
         result.status = 'success';
       }
       context.imageKey = imageKey;
       cb(result);
  },roundTripDelay);
}});

tasks.push({ name: "setTank", test: function (cb) {
  const result = {status: 'failed', errMsg: ''};
  const delivery = Deliveries.findOne(context.deliveryId);
  const p = new PODapi();
  p.setOrder(delivery, 0);
  const myTank = { type: 'lrp', before: 300, after: 3400 };
  p.setTank(context.docKey, 2, myTank);
  setTimeout(()=>{
       const delivery = Deliveries.findOne(context.deliveryId);
       p.setOrder(delivery, 0);
       const tank = p.getTank(context.docKey, 2);
       result.status = 'success';
       for (var key in myTank) {
         if (myTank.hasOwnProperty(key)) {
            if (myTank[key] !== tank[key]) {
              result.status = 'failed'
              result.errMsg = 'Object did not come back in tact tankno 2, ' + key + ' => ' + tank[key];
            }
         }
       }
       cb(result);
  },roundTripDelay);
}});
tasks.push({ name: "setTank again", test: function (cb) {
  const result = {status: 'failed', errMsg: ''};
  const delivery = Deliveries.findOne(context.deliveryId);
  const p = new PODapi();
  p.setOrder(delivery, 0);
  const myTank = { type: 'lrp', before: 300, after: 3400 };
  p.setTank(context.docKey, 4, myTank);
  setTimeout(()=>{
       const delivery = Deliveries.findOne(context.deliveryId);
       p.setOrder(delivery, 0);
       const tank = p.getTank(context.docKey, 4);
       result.status = 'success';
       for (var key in myTank) {
         if (myTank.hasOwnProperty(key)) {
            if (myTank[key] !== tank[key]) {
              result.status = 'failed'
              result.errMsg = 'Object did not come back in tact tankno 4, ' + key + ' => ' + tank[key];
            }
         }
       }
       cb(result);
  },roundTripDelay);
}});
tasks.push({ name: "removeTank", test: function (cb) {
  const result = {status: 'failed', errMsg: ''};
  const delivery = Deliveries.findOne(context.deliveryId);
  const p = new PODapi();
  p.setOrder(delivery, 0);
  p.removeTank(context.docKey, 4);
  setTimeout(()=>{
       const delivery = Deliveries.findOne(context.deliveryId);
       p.setOrder(delivery, 0);
       const tank = p.getTank(context.docKey, 4);
       result.errMsg = 'under construction';
       cb(result);
  },roundTripDelay);
}});
tasks.push({ name: "get_free_tank_nos", test: function (cb) {
  const result = {status: 'failed', errMsg: ''};
  const delivery = Deliveries.findOne(context.deliveryId);
  const p = new PODapi();
  p.setOrder(delivery, 0);
  const myTank = { type: 'di500', before: 600, after: 7400 };
  p.setTank(context.docKey, 4, myTank);
  setTimeout(()=>{
       const delivery = Deliveries.findOne(context.deliveryId);
       p.setOrder(delivery, 0);
       const tankNos = p.getUnusedTankNumbers(context.docKey);
       //console.log({tn:tankNos});
       const mustbe = [1, 3, 5, 6, 7, 8, 9, 10];
       result.status = 'success';
       for(let i=0;i<mustbe.length;i++) {
         if (mustbe[i] != tankNos[i]) {
           result.status='failed'; result.errMsg='Unused tank numbers incorrect';
         }
       }
       cb(result);
  },roundTripDelay);
}});

tasks.push({ name: "removeImage", test: function (cb) {
  const result = {status: 'failed', errMsg: ''};
  const delivery = Deliveries.findOne(context.deliveryId);
  const p = new PODapi();
  p.setOrder(delivery, 0);
  p.removeImage(context.docKey,context.imageKey);
  setTimeout(()=>{
       const delivery = Deliveries.findOne(context.deliveryId);
       p.setOrder(delivery, 0);
       const image = p.getImage(context.docKey, context.imageKey);
       if (_.isEmpty(image)) {
         result.status = 'success';
       }
       cb(result);
  },roundTripDelay);
}});

tasks.push({ name: "removeDoc", test: function (cb) {
  const result = {status: 'failed', errMsg: ''};
  const delivery = Deliveries.findOne(context.deliveryId);
  const p = new PODapi();
  p.setOrder(delivery, 0);
  p.removeDoc(context.docKey);
  setTimeout(()=>{
       const delivery = Deliveries.findOne(context.deliveryId);
       p.setOrder(delivery, 0);
       const doc = p.getImage(context.docKey);
       if (_.isEmpty(doc)) {
         result.status = 'success';
       }
       cb(result);
  },roundTripDelay);
}});


function run() {
  const q = async.queue((task, cb) => {
    // if (_.isArray(task)) {
    //   task.forEach((item)=>{q.push(item)});
    //   return cb();
    // }
    task.test((result) => {
      if(result.status === "success")
      console.log("OK: " + task.name);
      else {
        console.log("FAIL: " + task.name + result.errMsg )
      }
      cb();
    });
  });
  q.push(tasks);
}
export default {run};
