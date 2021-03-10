const router = require('koa-router')();
const Servers = require('../models/servers');
const Users = require('../models/users');

// 获取服务器列表
router.get('/list', async (ctx) => {
    try {
        const query = await Servers.find();
        ctx.body = {
            code: 200,
            data: query,
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            data: error,
        };
    }
});

// 购买服务器
router.post('/purchase', async (ctx) => {
    try {
        const {id} = ctx.request.body;
        const user = await Users.findOne({userName: ctx.session.user});
        await Servers.findByIdAndUpdate(id, {
            _user: user._id,
        });
        ctx.body = {
            code: 200,
            data: 'success',
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            data: error,
        };
    }
});

// 我的服务器
router.get('/me', async (ctx) => {
    try {
        const user = await Users.findOne({userName: ctx.session.user});
        const servers = await Servers.find({_user: user._id});
        ctx.body = {
            code: 200,
            data: servers,
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            data: error,
        };
    }
});

router.get('/init', async (ctx) => {
    const {ip} = ctx.request.query;
    const newIp = ip ? ip : '127.0.0.1';
    await Servers.create({
        ip: newIp,
        port: '8093',
        _user: null,
        price: 1000,
        simulator: 'Carla',  // 模拟器
        avSystem: 'Autoware',  // 自动驾驶系统
        expiredTime: '2021/2/19',
    });
    ctx.body = {
        code: 200,
        data: 'success',
    }
});

module.exports = router;
