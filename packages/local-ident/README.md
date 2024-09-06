# local-ident

考虑到vite(及webpack)默认的cssModule类名生成策略很难在可读性和哈希处理上取得权衡, 当前包提供了一个更优雅的生成策略.

当前策略的生成一定程度上参考了[BEM(Block Element Modifier)表示法](https://getbem.com/).

这个策略同时也涉及一个和cssModule整合比较好的表示法: 扁平表示法.

所谓独木不成森, 这里也涉及到了一个偏好————鼓励创建仅做很小的事情的组件. 这样组件的样式自然也足够简单和少烦恼.

对于较大的视图, 应由这些很小的组件组装而成. 当很难为样式应用扁平表示法时, 可能在决策如何抽象组件时就失了偏颇, 因为让组件做得太多.

## 扁平表示法

该表示法由Component、Flat-Selector、Global-State这几部分组成.

### Component

按BEM表示法,它隐式地要求了Block名字整个项目空间内是唯一的, 因为它并没有提供其它防冲突检测的方案. 也就是如果定义了两个Block都叫`bar`或者`menu`,
那大概你以后某一天就死定了(子弹在这一刻已经发出).

Component相似于BEM中的Block, 但是并不要要求在项目内是唯一的.

脚本的世界中, 一个项目内有两个Input组件或者两个Button组件, 我们是允许的; 那在这里, 样式的世界中, 这也应该是同样允许的.

处理的时候, 模块名首先会被翻译成小驼峰, 比如Input会被处理成input, SignIn会被处理成signIn.

同时, 在处理的时候, 有多个同名组件, 在后续的处理中会自动追加序列号.
如有两个Input组件, 第一个Input组件的名字会被处理成input, 第二个Input组件的名字会被处理成input1.

我们和commonjs模块规范相识相知的一路, 也有一些习惯留在了手边(那怕我们使用了ESM规范). 这里说的是, 使用index文件的习惯.
项目中可能会有`Input/index.vue`或者`Input/index.module.scss`这样的文件名, 但Component的名字这里是Input而非index.
也就是, 需要排序index文件的名字并选择它的父目录名.

同时Component首字体会由大写变成小写, 唯一的个例外是, Component全由大写组成时.

这几乎就是Component生成的全部, 如果没有使用模块联邦技术将几个构建结果合并到一起运行的话.

### Flat-Selector

需要有多扁平的选择器呢? 自然是能多扁平就多扁平.

也就是选择器中, 类选择器的个数不应多于一个.

下面是一个传统的需要预编译处理的样式片段.

```scss
.homepage {
  width: 100%;
  height: 100%;

  .homepage-background {
    display: flex;
    height: 40%;
    width: 100%;

    .homepage-background_img {
      flex: 1;
      width: 100%;
      height: auto;
    }
  }
}
```

在这该段样式中, 选择器权重最大的达到了三个类选择器: `.homepage .homepage_background .homepage_background_img`,
我们真需要维护那么长的选择器的样式么, 答案是否定的.

当切换到了cssModule中时, 不再需要那么多嵌套避免冲突, 不需要在选择器前面添加其它选择器进而组合成后代选择器来避免潜在的样式冲突, 因为cssModule本身就避免了样式冲突.

这时, 上述的样式片段调整成如下更适宜:

```scss
.homepage {
  width: 100%;
  height: 100%;
}

.homepage-background {
  display: flex;
  height: 40%;
  width: 100%;
}

.homepage-background_img {
  flex: 1;
  width: 100%;
  height: auto;
}
```

同时, 在类名选择器中, 也不需要附加前缀来避免潜在的冲突————而是,就应该**百无禁忌**, 怎么简单怎么来.

在上述样式片段中, 应该把`homepage`的前缀移除, 而`homepage`大概是指组件名, 它应在Component这一部分中表示, 而不应该是在Flat-Selector这一部分中表示.

同时, 推荐使用单单词表示法. 如果需要使用多个单词, 则命名规则应使用小驼峰. 小驼峰的这一偏好也是为了和脚本一致, 以及方便在脚本中被引用.

注: html是不区分大小写的, 但html中的类名是区分大小写的.

应用这些改动后, 上述样式片段可以简化为:

```scss
// homepage.module.scss or Homepage/index.module.scss or Homepage/index.vue <style> or Homepage.vue <style>
._ {
  width: 100%;
  height: 100%;
}

.background {
  display: flex;
  height: 40%;
  width: 100%;
}

// 或者是 .img
// 当需要组合使用多个单词时, 也可以考虑是否对应的组件功能是否承载的功能太多过于复杂
.backgroundImg {
  flex: 1;
  width: 100%;
  height: auto;
}
```

上述样式中出现了一个特殊的类名 `_`, 它是一个合法的类名, 甚至也是一个合法的变量名. 该类名一般用作根类名, 这是为了更好的可读性:

就上述叫cssModule, 如果它对应的component是homepage, 那么它将编译出如下css类名: homepage\_\_、homepage_background、homepage_backgroundImg.
这会比较方便地区分出根类名.

注: 根类名不是必须的, 对于一些特殊结构的组件可能并不存在根内容.

另外, 有时还会组合使用元素选择器, 但元素选择器的应用应该是有限的: 理想情况下, 一个组合选择器中, 元素选择器的个数应该不多于一个.
比如 `.bg h2 span`这样就是不良的选择器. 它应该是`.bg h2` 和 `.bg span`或者为h2元素span元素等添加一个类名, 将元素选择器转换为类选择器.

让我们来总结一下Flat-Selector的要点:

- 选择器尽可能的扁平化和不嵌套
- 选择器的命名中不需要带上Component作为前缀
- css类的命名规则是小驼峰
- 使用可选的类名`_`表示根类名
- 组合使用元素选择器时, 元素选择器的个数应该不多于一个

这对浏览器的渲染也是最友好的. ID选择器选择最快, 但因为ID选择器需要在DOM树中保持唯一, 这和组件的可复用性冲突所以我们并不能滥用它.
那能选的就只有类选择器了. 所有组件使用一个完全不会冲突的类选择器, 在兼顾代码的可复用性的前提下达到了最好的渲染性能.
并且, 这里我们也保持了较好的可读性.

### Global-State

对于一些形容词表示的状态, 如active, disabled, visible, hidden, closed, 或者一些常规的习惯性的规格表示法如md, lg, sm, xl, xxl等,
推荐使用Global-State.

Global-State是指这些表示状态或者规则的类名, 不再使用cssModule, 而是使用`:global`选择器将它们变成全局的(但需要在当前组件的上下文中), 如下:

```scss
// dialog.module.scss
._ {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 3px 14px 0 rgb(21 52 101 / 18%);
  border-radius: 2px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  z-index: 2;

  &:global(.md) {
    width: 640px;
    min-height: 165px;
    max-height: 80vh;
  }

  &:global(.lg) {
    width: 1000px;
    min-height: 500px;
    max-height: 80vh;
  }
}
```

在为根节点应用样式是, 应用的样式即为`<div class="dialog__ md">`或者 `<div class="dialog__ lg">`这样的, 这进一步达到了更多的可读性.

Global-State是唯一可允许“穿透”的样式, 但是样式穿透是一种负模式, 当出现时应该回头审视自己的组件设计.
但从技术上来进, Global-State的命名是稳定和, 所以允许“穿透”(如果真的需要的话).

但是, 如果真有需要透过组件api修改组件样式, 那推荐通过cssnext中的变量名设计来进行样式调整.

Global-State应对BEM表示法中的M(Modifier)的大部分(但不是全部).

这是BEM表示法中对Modifier的说明:

> <https://getbem.com/introduction/>
>
> ### Modifier
>
> A flag on a block or element. Use them to change appearance or behavior.
>
> #### Examples
>
> `disabled`, `highlighted`, `checked`, `fixed`, `size big`, `color yellow`

## 类名生成算法

在处理cssModule的样式, 编译时会对其中的类名进行哈希化以满足模块化.
该处理会排除属性选择器, 元素选择器, 及通过`:global`标记为全局的样式.

以如下样式为例:

```scss
.stars {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;

  & > div {
    opacity: 0.3;
  }

  :global(.active) {
    color: red;
  }
}

.slot {
  position: relative;
  z-index: 2;
  margin: auto;
}
```

需要处理的类名是starts, slot, 其中元素选择器div及全局类名active已经被排队.
也就是, Global-State处理时会保持原样, 这也是我们的期望.

生成的依凭是类名选择器className和文件名fileName.

- className示例: starts
- fileName示例: .../infinity/src/sign/components/StarrySky.vue?vue&type=style&index=0&lang.module.scss

其中, className映射了上述Flat-Selector部分, fileName映射成了Component.
