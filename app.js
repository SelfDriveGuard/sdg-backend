const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const cors = require('koa2-cors');
const Router = require('koa-router');

const mongoConf = require('./config/mongo');
mongoConf.connect();

app.use(bodyParser());
app.use(cors({
    credentials: true,
}));
app.keys = ['some secret hurr'];
app.use(session({
    key: 'koa:sess',  // 默认值，自定义cookie中的key
    maxAge: 86400000,
    autoCommit: true, /** 自动提交到响应头。(默认是 true) */
    overwrite: true, /** 是否允许重写 。(默认是 true) */
    httpOnly: true, /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
    signed: true, /** 是否签名。(默认是 true) */
    rolling: true, /** 是否每次响应时刷新Session的有效期。(默认是 false) */
    renew: false, /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
}, app));

const user = require('./routes/user');
const server = require('./routes/server');
const router = new Router();
router.use('/user', user.routes());
router.use('/server', server.routes());

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
    ctx.body = ctx.request.body;
});

app.listen(8092, () => {
    console.log('[Server] starting at port 8092')
});
