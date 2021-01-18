const router = require('koa-router')();
const Users = require('../models/users');
const fs = require('fs');
const path = require('path');
const send = require('koa-send');

const mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
};

const getAll = (dir) => {
    // 用个hash队列保存每个目录的深度
    const mapDeep = {};
    mapDeep[dir] = 0;

    // 先遍历一遍给其建立深度索引
    function getMap(dir, curIndex) {
        const files = fs.readdirSync(dir); //同步拿到文件目录下的所有文件名
        files.map(function (file) {
            //const subPath = path.resolve(dir, file) //拼接为绝对路径
            const subPath = path.join(dir, file); //拼接为相对路径
            const stats = fs.statSync(subPath); //拿到文件信息对象
            mapDeep[file] = curIndex + 1;
            if (stats.isDirectory()) { //判断是否为文件夹类型
                return getMap(subPath, mapDeep[file]) //递归读取文件夹
            }
        })
    }

    getMap(dir, mapDeep[dir]);

    function readDirs(dir, folderName, parentIndex) {
        const result = { //构造文件夹数据
            folderName: folderName,
            path: dir,
            name: path.basename(dir),
            isLeaf: false,
            key: parentIndex ? `0-${parentIndex}` : '0-0',
        };
        const files = fs.readdirSync(dir); //同步拿到文件目录下的所有文件名
        result.children = files.map((file, index) => {
            const subPath = path.join(dir, file); //拼接为相对路径
            const stats = fs.statSync(subPath); //拿到文件信息对象
            if (stats.isDirectory()) { //判断是否为文件夹类型
                return readDirs(subPath, file, index) //递归读取文件夹
            }
            const code = fs.readFileSync(path.join(__dirname, `../${subPath}`), 'utf8');
            return { //构造文件数据
                path: subPath,
                name: file,
                key: `0-${parentIndex}-${index}`,
                isLeaf: true,
                folderName: folderName,
                code,
            }
        });
        return result;
    }

    return readDirs(dir, dir);
};

// 获取项目
router.get('/getProject', async (ctx) => {
    const data = getAll(`project/${ctx.session.user}`);
    ctx.body = {
        code: 200,
        data: data.children,
    }
});

// 新建项目
router.post('/addProject', async (ctx) => {
    try {
        const {project, name} = ctx.request.body;
        mkdirsSync(path.join(__dirname, `../project/${ctx.session.user}/${project}`));
        fs.writeFileSync(path.join(__dirname, `../project/${ctx.session.user}/${project}/${name}.scenest`),
            'New File', 'utf8');
        ctx.body = {
            code: 200,
            data: '新建成功',
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            data: error,
        };
    }
});

// 项目 重命名
router.post('/updateProject', async (ctx) => {
    try {
        const {oldPath, isLeaf, updateName, folderName} = ctx.request.body;
        const oldPathParse = path.join(__dirname, `../${path.normalize(oldPath)}`);
        const newPath = isLeaf ? path.join(__dirname, `../project/${ctx.session.user}/${folderName}/${updateName}.scenest`) :
            path.join(__dirname, `../project/${ctx.session.user}/${updateName}`);
        fs.renameSync(oldPathParse, newPath);
        ctx.body = {
            code: 200,
            data: '重命名成功',
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            data: error,
        };
    }
});

// 项目 删除
router.post('/deleteProject', async (ctx) => {
    try {
        const {filePath} = ctx.request.body;
        const pathParse = path.join(__dirname, `../${filePath}`);
        fs.unlinkSync(pathParse);
        ctx.body = {
            code: 200,
            data: '删除成功',
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            data: error,
        };
    }
});

// 项目 保存
router.post('/saveProject', async (ctx) => {
    try {
        const {filePath, code} = ctx.request.body;
        const pathParse = path.join(__dirname, `../${filePath}`);
        fs.writeFileSync(pathParse,
            code, 'utf8');
        ctx.body = {
            code: 200,
            data: '保存成功',
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            data: error,
        };
    }
});

// 项目 下载
router.get('/downloadProject', async (ctx) => {
    const {filePath, name} = ctx.query;
    ctx.attachment(name);
    await send(ctx, filePath);
});

// 注册
router.post('/register', async (ctx) => {
    try {
        const {userName, password} = ctx.request.body;
        const query = await Users.findOne({userName: userName});
        if (query) {
            ctx.body = {
                code: 0,
                data: '用户名已存在',
            }
        } else {
            await Users.create({
                userName,
                password,
            });
            mkdirsSync(`project/${userName}/project1`);
            const template = fs.readFileSync(path.join(__dirname, '../template.scenest'));
            fs.writeFileSync(path.join(__dirname, `../project/${userName}/project1/demo1.scenest`), template);
            ctx.body = {
                code: 200,
                data: '注册成功',
            }
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            data: error,
        };
    }
});

// 登录
router.post('/login', async (ctx) => {
    try {
        const {userName, password} = ctx.request.body;
        const query = await Users.findOne({userName: userName});
        if (query) {
            if (query.password === password) {
                ctx.session.user = userName;
                ctx.body = {
                    code: 200,
                    data: '登录成功',
                };
            } else {
                ctx.body = {
                    code: 0,
                    data: '密码错误',
                };
            }
        } else {
            ctx.body = {
                code: 0,
                data: '没有该用户',
            };
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            data: error,
        };
    }
});

// 登出
router.post('/logout', async (ctx) => {
    ctx.session = null;
    ctx.body = {
        code: 200,
        data: 'success',
    };
});

// 查看用户是否登录
router.get('/me', async (ctx) => {
    ctx.body = {
        code: 200,
        data: !!ctx.session.user,
    };
});

module.exports = router;
