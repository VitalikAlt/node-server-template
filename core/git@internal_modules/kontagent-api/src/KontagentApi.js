'use strict';
const request = require('slim-request');
let log = {debug: console.log, info: console.log, warn: console.log, error: console.log};

class KontagentApi {
    static setLogs(logs = {}) {
        log = logs;
    }

    static trackError(error, userId, socialId, social, platform, level) {
        let errorMessage = "", st2;
        const params = {};
        const errorType = error.error_code || "unknown_error";
        userId = (userId == null)? '0' : userId;
        level = (level == null)? '0' : level;

        log.debug("Debug error", error);

        if (error.path)
            errorMessage = `${error.path} `;
        errorMessage += error.message;

        if (errorMessage)
            errorMessage = errorMessage.replace(/(\d+)|(\[.*?\])|(".*?")|('.*?')|({.*?})/g, "?").slice(0, 32);
        else
            errorMessage = "unknown";

        if (platform == null)
            st2 = `without_api`;
        else if (platform)
            if (social)
                st2 = `mobile_${platform}_${social}`;
            else
                st2 = `mobile_${platform}`;
        else if (social)
            st2 = `flash_${social}`;
        else
            st2 = "flash";

        params.n = errorMessage;                                                         // - имя ошибки, например “out of memory” (не более 32 символов)
        params.s = userId;                                                               // - userId
        params.sid = '0';                                                                // - id сессии
        params.st1 = "nodejs";                                                           // - платформа (ruby/nodejs/flash/ios/android)
        params.st2 = st2;                                                                // - тип ошибки
        params.st3 = errorType;                                                          // - тип ошибки
        params.st = error;
        params.l = (level == null)? 0 : level;   // - левел юзера

        log.error("trackError params", params);
        KontagentApi.sendMessage(userId, socialId, social, platform, level, "err", params)
    }

    static trackPayment(userId, socialId, social, platform, level, build, amount = undefined) {
        const params = {};
        userId = (userId == null)? '0' : userId;
        level = (level == null)? '0' : level;
        params.b = build;
        params.l = level;
        params.s = userId;
        params.v = amount * 100;
        params.tu = "direct";
        params.ts = (new Date()).getTime();
        KontagentApi.sendMessage(userId, socialId, social, platform, level, "mtu", params)
    }

    static trackEvt(userId, socialId, social, platform, level, st1, st2 = '', st3 = '', name = null, value = 1) {
        const params = {};
        userId = (userId == null)? '0' : userId;
        level = (level == null)? '0' : level;

        params.n = name || "unnnamed";
        params.st1 = st1;
        params.st2 = st2;
        params.st3 = st3;
        params.s = userId;
        params.sid = 0;
        params.created_at = (new Date()).getTime();
        params.v = value;
        params.l = level;
        KontagentApi.sendMessage(userId, socialId, social, platform, level, "evt", params)
    }

    static hashedUserId(userId, socialId, social) {
        if (social === "vk")
            return socialId;

        return userId.slice(0,9)
    }

    static sendMessage(userId, socialId, social, platform, level, evt, data) {
        //TODO need is admin check
        data.s = KontagentApi.hashedUserId(userId, socialId, social, data.s);
        log[(evt === "mtu")? "info" :"debug"](`kontagent ${evt} send: ${JSON.stringify(data)}`);
        request.send({alias: `stats_${evt}`, data})
            .then(null, (err)=>{KontagentApi.trackError(err, userId, socialId, social, platform, level)})
            .catch((err)=>{KontagentApi.trackError(err, userId, socialId, social, platform, level)});
    }
}

module.exports = KontagentApi;