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

module.exports = router;
