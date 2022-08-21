import index = require("node-telegram-bot-api");
import fs_extra = require("fs-extra");
const fast = require("fast-speedtest-api");
const axios = require("axios")
const config = require("../src/config.json");
const bot = new index(config.token, { polling: true });

bot.on("message", async (msg) => {
    // ————————————————— ignore old events ————————————————— //
    if(Math.floor(Date.now() / 1000) - msg.date > 2) return;
    
    // ————————————————— event ————————————————— //
    let args: string[] = (msg.text) ? msg.text.split(" ") : []; 
    let cmd: string =  args[0].slice(1, args[0].length) || "";
    let body: string = (msg.text) ? msg.text.slice(cmd.length + 1) : "";
    let event = {
        args,
        cmd,
        body,
        msg
    };
    await eventHandler(event, bot);
});


async function eventHandler(event: any, bot: any) {
    let { cmd, args, body, msg } = event;
    const URL = "https://dohongnhung.glitch.me/";
    if(cmd == "help") {
        bot.sendMessage(msg.chat.id, "List of commands: \n/help - show this list",  { reply_to_message_id: msg.message_id });
    };
    if(cmd == "fast"){
        const speedTest = new fast({
            token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
            verbose: false,
            timeout: 10000,
            https: true,
            urlCount: 5,
            bufferSize: 8,
            unit: fast.UNITS.Mbps
        });
       const old = await bot.sendMessage(msg.chat.id, `Đang tiến hành đo tốc độ mạng.`, { reply_to_message_id: msg.message_id });
       return bot.editMessageText(`${await speedTest.getSpeed()} Mbps!`, { message_id: old.message_id, chat_id: old.chat.id });
    };
    if(cmd == "titkok") {
       const url = `${URL}/tiktok`;
       const params = {
              url: args[1]
       };
       try {
       const data = (await axios.get(url, { params: params })).data;
       return bot.sendVideo(msg.chat.id, data, { reply_to_message_id: msg.message_id });
       }
       catch(e) {
           return bot.sendMessage(msg.chat.id, `${e}`, { reply_to_message_id: msg.message_id });
       };
    };
    if(cmd == "pinter") {
         const url = `${URL}/pinters_mp4`;
         const params = {
                  data: args[1]
         };
         try {
         const data = (await axios.get(url, { params: params })).data;
         const video = data.medias.map((item: any) => item.url);
         return bot.sendVideo(msg.chat.id, video[0], { reply_to_message_id: msg.message_id });
         }
         catch(e) {
              return bot.sendMessage(msg.chat.id, `${e}`, { reply_to_message_id: msg.message_id });
         };
    };
};