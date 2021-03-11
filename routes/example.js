const router = require('koa-router')();
const fs = require('fs');
const path = require('path');


// 查看场景库代码
router.get('/', async (ctx) => {
    const {name} = ctx.request.query;
    const code = fs.readFileSync(path.join(__dirname, `../example/C-NCAP/${name}`), 'utf8');
    ctx.body = {
        code: 200,
        data: code,
    }
});

module.exports = router;
