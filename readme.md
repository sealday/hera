## 赫拉管理系统


## 开发步骤
- 安装 mongodb
- 安装 nodejs 为了保证使用的依赖版本一致，最好也安装 yarn，但是不强求
- 在 client 和 server 目录下各自执行一次 yarn install（或者 npm install ）来安装依赖
- server/bin 目录下有三个可执行文件，都是 js 写的，分别执行 init 和 types 来导入基本的数据
- 可以执行项目根目录下的 dev 来启动开发，也可以先在 server 目录下执行 node bin/www，之后在
client 目录下执行 npm start 来开发（注意，服务器端口一定需要在3000，因为前端的转发是映射到
3000 端口中）
