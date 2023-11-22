const qrcode = require('qrcode-terminal');

const { Client, RemoteAuth } = require('whatsapp-web.js');

const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

mongoose.connect(`YOUR_MONGOOSE_CONNECTION_STRING`).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        })
    });

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.on('remote_session_saved', () => {
        console.log('session saved');
    });

    client.on('message', message => {
        if (message.body === '!ping') {
            message.reply('pong');
        }
    });

    client.initialize();
});