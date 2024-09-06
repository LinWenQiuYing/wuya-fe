# CHANGELOG

## 0.0.1

- 对所有依赖项和开发依赖项进行版本升级(`pnpm upgrade`), 执行该命令时major版本(参考semver版本语义化)是锁定的, 所以是安全的
- 将`@element-plus/icons`替换为`@element-plus/icons-vue` (因为前者已经废弃了)
- 将`eslint-config-standard-with-typescript`替换为`eslint-config-love`(因为前者已经废弃了)
  同时`@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` 的major版本由5升级到6
- 厘正开发依赖项和依赖项的位置:
  - 将@typescript-eslint/parser, rollup-plugin-visualizer, ts-node, typescript, unplugin-auto-import, unplugin-vue-components, vite-plugin-compression, vite-plugin-eslint, vite-plugin-qiankun, vite-plugin-svg-icons 移到到 devDependencies
  - 将axios移动到 dependencies
- axios由0.26.1升级到1.6.8, 以修正安全漏洞CVE-2023-45857 Cross-Site Request Forgery (CSRF)
- 开启git hook
  - commit-msg: 使用commitlint进行提交消息规范
  - pre-commit: 使用eslint进行格式检测, 并使用prettier进行自动格式化:
    ```json
    {
      "lint-staged": {
        "*.{ts,js,vue}": "eslint --fix",
        "**/*": "prettier --write --ignore-unknown"
      }
    }
    ```
- 添加stylelint并整合到了git提交钩子里

## 0.0.2

- 将package.json中的name属性(即项目名)由`my-vue-app`重命名为`infinity-face`
  这意味着, `*.js`文件默认使用ESM模块(即import, export)而非(require, exports), 同时**dirname也被替换掉. 若要替换, 请参考如下(Alternative for **dirname in Node.js when using ES6 modules).
- 移除根目录的`.env`环境变量配置文件(因为这不是根据环境变化的“环境变量”)而是一个CONST声明, 并将内容`VITE_BASE_URL=/transchaos`内联到`vite.config.ts`中
- 移除依赖项`vite-plugin-compression`, 同时构建时不再压缩成gzip, 应由web容器nginx进行动态压缩, 以便可以和浏览器约定更多的压缩算法, 以及方便对生成的js文件进行调试
- 移除根目录的`.env.production`及, 因为不再需要, 同时也不应由该环境变量文件声明
- 移除依赖项`unplugin-vue-components`及**ban掉代码中的这种隐式依赖**(详情见下面的unplugin-auto-import), 一方面不利于测试和其它工具进行代码分析(因为工具需要额外理解这种自动引入)
  但`unplugin-auto-import`需要继续保留, 因为组件库element-plus依赖它进行默认的组件导入, 尽管推荐显式地引入相应组件
- 移除依赖项`rollup-plugin-visualizer`, 我们暂时不需要对构建结果进行可视化分析
- 移除`src/plugins`下面的内容(vite插件配置片段)并将内容迁移和内联到根目录的`vite.config.ts`文件中
- 将`src/style`目录重命名为`src/styles`以和utils, hooks等复数风格保持一致
- scss中不再使用别名`@`, 而是改为直接使用src目录名. sass引擎对路径的查找同typescript的`"moduleResolution": "Classic"`
- scss中隐式依赖移除: 不再为所有scss文件隐式地在头部添加`@import './src/style/theme.scss';`, 改为手动引入
- 移除`src/plugins`及`types/auto-imports.d.ts`, `types/components.d.ts`, 并将位置`types/components.d.ts`的位置调整为`node_modules/@types/components.d.ts`
- `vite.config.ts`中移除别名配置`resolve: {alias: { "@": path.resolve(__dirname, "src") }}`, 并改为使用依赖项`vite-tsconfig-paths`来从tsconfig.json中的path中解析出路径映射,
  所有路径映射应直接在`tsconfig.json`中定义, 也应只在这个文件中定义.
-

### > Alternative for \_\_dirname in Node.js when using ES6 modules

As of Node.js 10.12 there's an alternative that doesn't require creating multiple files and handles special characters in filenames across platforms:

```js
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
```

Starting with Node.js 14.14, built-in modules can be written with the node: schema:

```js
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
```

Starting with Node.js 20.11 / 21.2, you can use import.meta.dirname:

```js
const __dirname = import.meta.dirname;
```

### unplugin-auto-import

Auto import APIs on-demand for Vite, Webpack, Rspack, Rollup and esbuild. With TypeScript support. Powered by unplugin.

没有使用这个插件时, vue的依赖项需要手动引入.

```ts
import { computed, ref } from "vue";

const count = ref(0);
const doubled = computed(() => count.value * 2);
```

使用了这个插件后, 可以自动被引入, 如下.

```ts
const count = ref(0);
const doubled = computed(() => count.value * 2);
```

## 0.0.3

- 添加依赖typescript-plugin-css-modules, 让cssModule在vue文件中有类型提示
- 移除冗余的Layout设置(AdminLayout, ClientLayout), 改为通过在路由树中直接指定
- 通过额外创建一个axios实例的方式, 修正了axios升级导致的文件错误
- 添加了一个vite-plugin-css-injected-by-js用于引入cssModule的样式, 但功效未如预期. 目前发现在乾坤框架下有误,但不通过乾坤框架加载样式正常

## 0.0.4

鉴于eslint对vue文件的检查缺失, 以及(ts, vue文件中)类型检查缺失, 这里对eslint配置进一步进行了修正.

同时, 将eslint config切换为了eslint flat config.

以及, 权衡了node包的模块规范与 vite, eslint 之间的生态关系.

- vite偏好ESM并鼓励废弃commonjs, 这与它仅面向未来浏览器的初衷相一致;
- eslint的受众拥有更广泛的群体, 因此前进更谨慎也更保守.
  它更偏好commonjs模块规范, 配置文件`.eslintrc.js`使用的模块类型并不想受node包的模块规范控制. 但好消息是eslint flat config受该配置控制.

换句话说, 如果不在`package.json`中设置`"type": "module"`, 那么vite就会假设`vite.config.ts`是使用commonjs规范的, 就会在控制台抱怨说,
“commonjs要废弃了, 请使用esm”, 尽管我们在一个ts文件内不太可能使用commonjs.
这时的办法有两个, 其中一个将`vite.config.ts`重命名作`vite.config.mts`, 另一个是在`package.json`中设置`"type": "module"`.
相比于使用后缀`mts`, 我更情愿设置当前包的模块规范为ESM. 但是, 若将包的模块规范为ESM, 那在`.eslintrc.js`中使用`module.exports`是不合法的,
但若使用`export`, 则`.eslintrc.js`又抱怨说不认识ESM规范. 办法就是将`.eslintrc.js`换成`.eslintrc.mjs`, 显式告诉它这是ESM模块规范.

但若调整为使用`eslint.config.js`, 它可以从`package.json`中的type字段知道这是一个啥模块规范的文件, 并不需要通过`cjs`, `mjs`的后缀显式区分.

注: node包的模块规范共有ESM, commonjs两种, 通过package.json中顶层type属性(`"module"|"commonjs"`)设置

## 0.0.5

- 新增注册模块`src/sign`
- 将注册逻辑迁移到当前项目
- 移除根路径`/transchaos`, **图片可以调整到public目录了**
- **当前模块不再能作为乾坤的微服务之一**, 启动逻辑也随之做相应简化
- 移除依赖项`@amap/amap-jsapi-loader`, `vite-plugin-qiankun`
- `tsconfig.json`中将`compilerOptions.strict`调整为`true`, 也就是类型检测的时候不再忽略null和undefined.
- 添加一种全局store的状态披露及使用的风格(可见src/store/hooks/useUserInfo.ts)
- 将src/hooks/userQuit替换为src/sign/hooks/useReSign
- 将 src/client/hooks/userPerson 替换为 src/store/hooks/useUserInfo
- 用户信息不再保存到localStorage中, 而是调整到store中并应通过 useUserInfo 这个hook获取
- 移除对localStorage的依赖
- 发送ajax请求时移除对Authorization这个头的设置, 现在鉴权通过cookie透明处理掉了
- 添加401状态的处理(见src/sign/components/AuthGuard.vue)
- 添加一个对element-plus的样式重置的文件 src/styles/el-reset.scss, 全局的样子重置也许可以放这里, 直到找到更好的方式
- 添加一个`.env`文件用于配置**开发环境**, 详情见[README.md](./README.md), 并添加相应的对后端接口路径前缀的代理
- CI流程中不再使用scp命令增量式上传, 而是使用async同步构建目录到远程目录(也就是冗余文件不再保留)

## 0.0.6

移除了 `userGlobalProperties` 这个hook和相应的改动:

- 冗余的`_this`变量不再包含和使用
- api/\*里相应地简化对该`_this`的引用, 移除了cancelToken的引用, 移除了冗余的null.

### 0.0.7

- 添加了vitest作为测试工具
- 为cssModule添加了更友好的的ID生成算法
- 同时也添加了一个workspace包 local-ident, 它同时也是一个测试示例, 和模块拆分示例.

注: vite对monorepo的支持还在进行中, 所以当前项目暂时还不能是一个ts项目的monorepo.

### 0.0.8

- 为了对electron和iframe提供更好的支持, 将鉴权方式由通过cookie调整为通过Authorization头.
- 优化了后端接口请求401时的处理, 提供了更优雅的和对electron更友好的跳转处理
- 提供了一种在url中注入token的机制`?token=xxx`, 在这里xxx解码后变会成axios请求的Authorization头
- 将axios实例在创建时就固定下来应用的Authorization头, 调整为通过axios过滤器动态设置, 以便axios请求能应用上新的Authorization值
- 提供了URL查询字符器透传的机制, 在进入下一个路由的时候, 会自动捎带上

### 0.0.9

- 重构了管理端的Layout, 包括样式优化, 及侧边栏重写
- 添加了一种从路由表中根据路由项元信息(即`RouteMeta`)提取出菜单项的机制
- 对管理端的路由项的访问路径进行了一定程度的简化
- 重构了404页面, 现在是`NoFound`组件
- 将types目录移动为src/@types目录
- 重写了vue-router下面的RouteMeta接口, 以吻合实际使用的路由项元信息

### 0.0.10

这个版本对svg图标进行了梳理及部分优化.

- 移除vite-plugin-svg-icons, svg图标将通过vite-svg-loader直接加载为vue组件
- 移除`src/admin/assets/icon`, `src/admin/icon` 目录, 并替换为`src/admin/icons`目录
- 移除`src/client/assets/icon`目录并替换为`src/client/icons`目录
- 移除`src/assets/icon` 目录
- 移除`src/assets/js/iconfont.font.js`文件
- svg图标重构

### 0.0.11
- 重构了模型列表的获取, 及对选中模型的更新
- 提供了一种更友好的使用vuex store中的方式, 详情见 src/store/hooks/useModelType.ts, 相比于react的UseState风格, ref风格可能更吻合vue的偏好
- 移除了依赖项 `vite-plugin-css-injected-by-js`, 它可能从来不是必须的
- 移除了依赖项 `js-cookie`, 鉴于electron对用cookie同步数据的不偏好, 及使用cookie同步数据的所有地方已经移除, 可移除该cookie工具
- 添加了OEM配置的第二种方式: 通过json配置文件配置

OEM配置目前仅有一个配置: 标题. 
约定配置文件均是conf目录(public/conf, 请求路径/conf)下面的json文件, 并通过store访问它们. 示例可见src/client/hooks/useTitleConf.ts

### 0.0.12

距离上次记录changelog, 项目中已经添加了很多业务上的实现.

这里重新对依赖项进行了梳理.

移除了下列不需要的依赖项:

- `@antv/g2plot`
- `@highlightjs/vue-plugin`
- `@vue/reactivity`
- `moment`
- `@slite/unified-mdast-to-delta`


修正或优化了如下eslint插件的使用

- `eslint-plugin-prettier`
- `eslint-plugin-promise`

移除了 `eslint-plugin-import`, 因为它和 `eslint@^9` 不能很好地一起工作.

移除了 `eslint-plugin-n`, 因为针对nodejs环境下的代码, 和目前针对浏览器开发的代码, lint上有部分细微差别.

同时对所有依赖项进行了升级, 升级到了最新版本, 而不是适配范围内的最新版本.
