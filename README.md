# 自动驾驶测试后端

## 依赖

nodejs: sudo apt-get install -y nodejs

mongoDB: sudo apt-get install mongodb

npm: sudo apt-get install npm
ps: ubuntu下npm版本过低 需要 sudo npm install -g npm 升级版本

npm install

pm2: npm install -g pm2 (服务器部署时需要)

## 部署

1.mongoDB连接: 修改 ./config/mongo.js 

本地： url = "mongodb://localhost:27017/ADTest"

服务器： url = "mongodb://cygRoot:cyg1tracy@118.31.126.252:29089/ADTest?authSource=admin";

2.启动服务 

本地： node app.js

服务器： pm2 start app.js

3.初始化数据
浏览器输入 /server/init?ip=${server_ip}
添加服务器实例：http://127.0.0.1:8092/server/init?ip=172.16.111.155



