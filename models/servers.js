const mongoose = require('mongoose');

const {Schema} = mongoose;

// Schema
const serverSchema = new Schema({
    ip: {type: String},
    port: {type: String},
    _user: {type: Schema.Types.ObjectId, ref: 'users'},
    price: {type: Number},
    simulator: {type: String},  // 模拟器
    avSystem: {type: String},  // 自动驾驶系统
    expiredTime: {type: Date},
});

// Model
const servers = mongoose.model('servers', serverSchema);

module.exports = servers;
