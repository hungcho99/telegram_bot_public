"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index = require("node-telegram-bot-api");
const fast = require("fast-speedtest-api");
const axios = require("axios");
const config = require("../src/config.json");
const bot = new index(config.token, { polling: true });
bot.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    // ————————————————— ignore old events ————————————————— //
    if (Math.floor(Date.now() / 1000) - msg.date > 2)
        return;
    // ————————————————— event ————————————————— //
    let args = (msg.text) ? msg.text.split(" ") : [];
    let cmd = (args[0]) ? args[0].slice(1, args[0].length) : "";
    let body = (msg.text) ? msg.text.slice(cmd.length + 1) : "";
    let event = {
        args,
        cmd,
        body,
        msg
    };
    yield eventHandler(event, bot);
    yield event_join_left(event, bot);
}));
function event_join_left(event, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        let format = {
            author: event.msg.from.id || null,
            nameAuthor: event.msg.from.first_name + " " + event.msg.from.last_name || null,
            threadID: event.msg.chat.id,
            threadName: event.msg.chat.title || null,
            new_chat_members: (typeof event.msg.new_chat_members == "object") ? event.msg.new_chat_members : null,
            left_chat_member: event.msg.left_chat_member || null
        };
        if (format.new_chat_members != null) {
            const name = format.new_chat_members.map((x) => (x.username.length == 0) ? x.first_name : x.username);
            const msg = `${name.join(", ")} vừa tham gia vào group '${format.threadName}'`;
            return bot.sendMessage(format.threadID, msg);
        }
        ;
        if (format.left_chat_member != null) {
            const name = format.left_chat_member.username.length == 0 ? format.left_chat_member.first_name : format.left_chat_member.username;
            const msg = `${name} vừa bay màu khỏi '${format.threadName}'`;
            return bot.sendMessage(format.threadID, msg);
        }
        ;
    });
}
;
function eventHandler(event, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        let { cmd, args, body, msg } = event;
        const URL = "https://apihungcho99-production.up.railway.app";
        if (cmd == "help") {
            bot.sendMessage(msg.chat.id, "List of commands: \n/help - show this list", { reply_to_message_id: msg.message_id });
        }
        ;
        if (cmd == "fast") {
            const speedTest = new fast({
                token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
                verbose: false,
                timeout: 10000,
                https: true,
                urlCount: 5,
                bufferSize: 8,
                unit: fast.UNITS.Mbps
            });
            const old = yield bot.sendMessage(msg.chat.id, `Đang tiến hành đo tốc độ mạng.`, { reply_to_message_id: msg.message_id });
            return bot.editMessageText(`${yield speedTest.getSpeed()} Mbps!`, { message_id: old.message_id, chat_id: old.chat.id });
        }
        ;
        if (cmd == "titkok") {
            const url = `${URL}/tiktok`;
            const params = {
                url: args[1]
            };
            try {
                const data = (yield axios.get(url, { params: params })).data;
                return bot.sendVideo(msg.chat.id, data, { reply_to_message_id: msg.message_id });
            }
            catch (e) {
                return bot.sendMessage(msg.chat.id, `${e}`, { reply_to_message_id: msg.message_id });
            }
            ;
        }
        ;
        if (cmd == "pinter") {
            const url = `${URL}/pinters_mp4`;
            const params = {
                data: args[1]
            };
            try {
                const data = (yield axios.get(url, { params: params })).data;
                const video = data.medias.map((item) => item.url);
                return bot.sendVideo(msg.chat.id, video[0], { reply_to_message_id: msg.message_id });
            }
            catch (e) {
                return bot.sendMessage(msg.chat.id, `${e}`, { reply_to_message_id: msg.message_id });
            }
            ;
        }
        ;
    });
}
;
//# sourceMappingURL=index.js.map