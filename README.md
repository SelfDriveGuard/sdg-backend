# sdg-backend
自驾保后台项目

>本文档是后台项目说明文档，自驾保整体环境搭建，请参照：[环境搭建](https://github.com/SelfDriveGuard/sdg-engine/blob/master/docs/setup/setup.md)

## 依赖

nodejs:

下载最新版nodejs:  [下载地址](https://nodejs.org/en/download/)

安装步骤：[安装方法](https://github.com/nodejs/help/wiki/Installation)

mongoDB: sudo apt-get install mongodb

npm install

pm2: npm install -g pm2 (服务器部署时需要)

## 部署

1.mongoDB连接: 
```
mongod --dbpath=/var/lib/mongodb --port 8094 --bind_ip 0.0.0.0 --logpath=/var/log/mongodb/mongodb.log --fork
mongo --port 8094 
use admin 
db.createUser({ user:'sdg',pwd:'123456',roles:[ { role:'readWriteAnyDatabase', db: 'admin'}]})
mongod --shutdown --dbpath /var/lib/mongodb
mongod --dbpath=/var/lib/mongodb --port 8094 --bind_ip 0.0.0.0 --auth --logpath=/var/log/mongodb/mongodb.log --fork
```
修改 ./config/mongo.js 

url = "mongodb://sdg:123456@localhost:8094/SelfDriveGuard?authSource=admin";

2.启动服务 

本地： node app.js

服务器： pm2 start app.js

3.初始化数据

添加服务器实例：http://127.0.0.1:8092/server/init?ip=172.16.111.155



