var request = require('request');
var sessionmap = new Map();

(function myBot() {
  'use strict'

  let Avaamo = require('./lib/avaamo').Avaamo,
    Link = require('./lib/avaamo').Link,
    printMessage = function(payload, avaamo) {
      //message is received here
      //Do any processing here
      let name = payload.message.getSenderName("User"),
        content = payload.message.hasAttachments() ? payload.message.whichAttachment() : payload.message.getContent(),
        conversation_uuid = payload.message.getConversationUuid();

      console.log(`\n==> ${name}: ${content}`);

      var chatsessionid=sessionmap.get(conversation_uuid);
      if(chatsessionid==null)
              chatsessionid="";

      request.post({ url:'http://127.0.0.1:5000', form: {session:chatsessionid,data:content}},function(err,httpResponse,body){
             var jsonobj=JSON.parse(body);
             sessionmap.set(conversation_uuid,jsonobj.session);
             avaamo.sendMessage(jsonobj.response,conversation_uuid); 
       });

    },

    printAck = function(ack, avaamo) {
      //acknowledgement processing
      let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      console.log(`\n==> Message read by: ${ack.user.first_name} at ${date}`);
    },
    printActivity = function(activity) {
      let name = "User", event = null;
      if(activity.user) {
        name = `${activity.user.first_name} ${activity.user.last_name}`;
      }
      if(activity.type === "user_visit") {
        event = "visited";
      }
      const date = new Date(activity.created_at*1000);
      console.log(`\n==> ${name} ${event} me at ${date}\n`);
    },
    //bot uuid goes here
     bot_uuid = "56c2b1bd-59a4-46b4-80ad-dbe49aabaec2",
    //bot access token goes here
    access_token = "VwyYahE_R2pGEmJQ6EANtFNFioqAVGqf";

  new Avaamo(bot_uuid, access_token, printMessage, printAck, printActivity);

})();
