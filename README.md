# Infinity Face

## 启动开发环境

需要先安装[nodejs](https://nodejs.org/en/download)及包管理工具[pnpm](https://pnpm.io/zh/next/installation).

```shell
# 初始化依赖
pnpm install
# 如果没有 .env 文件则创建默认的 .env 文件
# .env 文件仅开发环境需要 ( .env 文件不提交到远程仓库)
# .env 文件里的是自定义配置项
[ -f ".env" ] || echo BACKEND=http://172.18.20.142:8090 > .env
# 启动开发模块
pnpm dev
```

## 配置化

这里是指通过URL参数对界面执行一些粗略的配置化.

目前有:

- token注入
- 启用纯净模式
- 关闭推荐问题

### token注入

允许通过url动态地注入token. token这里是指向后端请求时用于鉴权的Authorization首部.

token不能以Authorization原值注入, 而是需要调用 [btoa()](https://developer.mozilla.org/zh-CN/docs/Web/API/btoa)
函数将它编码成ASCII字符串.

打开浏览器控制台, 调用btoa函数可得到编码结果.

```js
btoa("Bearer c99732dd-5b1d-41d1-a1a2-03f9a54fa9df");
// => "QmVhcmVyIGM5OTczMmRkLTViMWQtNDFkMS1hMWEyLTAzZjlhNTRmYTlkZg=="
```

编码结果中最后的一到多个`=`部分可以移除和忽略.

以`http://172.18.20.142:8090`环境为例, 向它注入token `Bearer c99732dd-5b1d-41d1-a1a2-03f9a54fa9df`,
可直接使用如下url进行token注入.

token会被剪下, 解码并缓存, 并在向后端接口请求时带上.

```url
http://172.18.20.142:8090?token=QmVhcmVyIGM5OTczMmRkLTViMWQtNDFkMS1hMWEyLTAzZjlhNTRmYTlkZg
```

注: 注入时不区分页面, 在那个页面下注入都是可以的, 都可以正常注入.

注: token注入是候选功能, 后续可能会因为安全原因调整实现(比如根据密钥进一步编码等).

### 启用纯净模式

可在url中通过指定`pure=on`启用纯净模式.

纯净模式下, 不再显示页面和侧边栏菜单.

### 关闭推荐问题

问答页面, 可在url中通过指定`recommend=off`不再加载推荐.

### 国际化

#### 添加国际化文件

国际化文件规定在locales文件夹下面创建支持语言对应的`json`文件，例如在`src/sign/locales`下面的`en.json`,`zh.json`，
使用方式如下:

- 创建一个引用翻译json文件的hooks

```javascript
import en from "./en.json";
import zh from "./zh.json";
import { useI18n } from "vue-i18n";

const messages = {
  en,
  zh,
};
export default () => useI18n({ messages });
```

- 使用创建hooks的t函数进行翻译

```javascript
<template>
  <div>{{ t("翻译")}}</div>
</template>
<script lang="ts" setup>
  import useI18n from "../locales";
  const {t} = useI18n();
</script>

```

#### 提取所有模块下的国际化文件

执行命令 node scan.js 将会提取所有的国际化文件并在根目录下的`locales`文件夹下，格式如下：

```json
{
  //src\sign\locales\en.json
  "欢迎登录": "Welcome to login",
  "手机号/用户名/邮箱": "Mobile phone number/username/Email address"
}
```

`//`注释后面是提取文件的路径

#### 更新国际化文件

在命令行执行 node parse.js，将根目录下`locales`下提取各个模块的文件写入到各个模块中