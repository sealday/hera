# 赫拉服务端

## 安装

```bash
$ yarn
```

## 配置

根据实际情况配置，保存到项目根目录中的 .env 文件
```ini
SECRET=<here is secret>
MONGODB_URI=mongodb://localhost/hera
```

## 运行

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 测试

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

  HeraServer is [MIT licensed](LICENSE).
