const router = require('koa-router')();
const fs = require('fs');
const path = require('path');

const getAll = (dir) => {
    // 用个hash队列保存每个目录的深度
    const mapDeep = {};
    mapDeep[dir] = 0;

    // 先遍历一遍给其建立深度索引
    function getMap(dir, curIndex) {
        const files = fs.readdirSync(dir); //同步拿到文件目录下的所有文件名
        files.map(function (file) {
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

// 查看场景库代码
router.get('/', async (ctx) => {
    const data = getAll(`example`);
    ctx.body = {
        code: 200,
        data: data.children,
    }
});

module.exports = router;
