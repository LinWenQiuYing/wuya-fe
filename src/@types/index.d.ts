import "vue-router";
import { Condition } from "#condition";
import { FunctionalComponent } from "vue";

/**
 * 构建目标
 *
 * electron和web使用同一份代码, 但是逻辑有时有细微差别
 *
 * 运行平台为h5,pc,app时, 构建目标均为web
 */
export type BuildTarget = "web" | "electron";

/**
 * 严格的、展开的跨平台配置, 当为所有平台指定配置项时, pc平台的配置是必须指定的
 *
 * pc平台的配置将作为其它平台的备选
 */
export type StrictExpandedCrossPlatform<T> = {
  pc: T;
  h5?: T;
  electron?: T;
  app?: T;
};

/**
 * 松散的、展开的跨平台配置, 它的配置项可以缺省(即可以为空对象`{}`)
 *
 * 用于有默认值的跨平台配置
 */
export type LooseExpandedCrossPlatform<T> = {
  [p in Platform]?: T;
};

/**
 * 平台划分:
 * - `pc`: 通过pc上的web浏览器访问
 * - `h5`: 通过手机上的web浏览器访问
 * - `electron`: 通过电脑上的本地应用访问
 * - `app`: 通过手机上的原生应用访问
 *
 * 平板电脑上的访问时的划分, 取决于操作系统, 比如:
 * - iPad是使用iOS系统, 则它是 h5 和 app
 * - windows系统的pad则应属于 pc + electron
 */
export type Platform = keyof StrictExpandedCrossPlatform<unknown>;

/**
 * 跨平台兼容的配置要求
 *
 * 对它的要求如下:
 * - 如果是对象的话, 不能使用类型`Platform`作为key
 * - 否则则只能是数组, 函数, string, number, boolean
 */
export type CrossCompatible<S extends string = unknown> =
  | Record<Exclude<S, Platform>, unknown>
  | FunctionalComponent
  | unknown[]
  | string
  | number
  | boolean;

/**
 * 严格的跨平台配置(pc的配置必须指定)
 * - 可以为所有平台指定同一配置项
 * - 也可以为各平台指定不同配置项
 */
export type StrictCrossPlatform<T extends CrossCompatible = unknown> = StrictExpandedCrossPlatform<T> | T;

/**
 * 松散的跨平台配置(pc的配置可以不指定), 用于有默认值的场景
 * - 可以为所有平台指定同一配置项
 * - 也可以为各平台指定不同配置项
 */
export type LooseCrossPlatform<T extends CrossCompatible = unknown> = LooseExpandedCrossPlatform<T> | T;

/**
 * 跨平台配置, 是严格的跨平台配置的别名
 */
export type CrossPlatform<T extends CrossCompatible = unknown> = StrictCrossPlatform<T>;

// 对sidecar的详细配置, 允许部分内容不展示
export type SidecarConfig =
  | {
      // 排除部分成员不显示
      exclude: SidecarMember[];
    }
  | {
      // 仅部分成员显示
      include: SidecarMember[];
    }
  | { [P in SidecarMember]?: boolean | "readonly" };

// sidecar成员
export type SidecarMember =
  // 新话题
  | "topicGenerator"
  // 知识源
  | "sources"
  // 历史收藏
  | "history";

// 导航拦截器
export interface NavInterceptor {
  // `auth`表示是否需要登录(即游客模式下是否可访问)
  // 标记为`auth`的导航项无法导航, 并在hover时会提示登录
  auth?: Condition<Platform> | boolean;
}

/**
 * 对路由匹配的一种表达
 * [Shell Glob](https://en.wikipedia.org/wiki/Glob_(programming))
 *
 * 如:
 * - `/`表示精确匹配`根路由`
 * - `/news`精确匹配路由 `/news`
 * - `/new/*`匹配路径前缀是 `/new/`的任意路由
 */
export type Glob = string;

/**
 * 网络状态 (即 离线与否)
 */
export type NetworkStatus = { offline: boolean };

/**
 * 导航栏的隐藏条件
 *
 * 在条件中包含布尔值没有数学意思, 但有一定的业务意义, 可用于快速隐藏某个导航栏
 */
export type NavHiddenCondition = Condition<Platform | NetworkStatus> | boolean;

/**
 * 将一个功能标记为alpha阶段的条件
 */
export type AlphaCondition = Condition<Platform> | boolean;

// 菜单导航项 (配置侧, 不同平台可指定不同的图标)
export interface NavConfig {
  // 导航项对应展示的文本
  name: string;
  // 导航项对应的图标
  icon: CrossPlatform<FunctionalComponent>;
  // 导航项的active条件, 不重写active条件则默认为通过path判断active条件
  active?: Condition<Glob>;
  // 当前导航项的隐藏条件
  hidden?: NavHiddenCondition;
  interceptor?: NavInterceptor;
  path: string;
  // 是否为小助手
  agent?: boolean;
  // 菜单排序 默认为 1 值大靠后
  order?: number;
}

// 菜单导航项 (使用侧, 冗余的、别的平台的信息已经移除)
export interface Nav extends Omit<NavConfig, "icon" | "interceptor"> {
  icon: FunctionalComponent;
  alpha?: boolean;
  interceptor?: {
    auth?: boolean;
  };
}

declare module "vue-router" {
  // 导航栏的链接由RouteMeta中的数据创建
  export interface RouteMeta {
    // 为当前路由项添加导航链接(添加在侧边栏中)
    nav?: Omit<NavConfig, "path">;
    //  菜单风格
    menuStyle?: CrossPlatform<MenuStyle>;
    // 是否显示 sidecar (pc菜单栏中, 菜单旁边的小斗)
    sidecar?: boolean | SidecarConfig;
    // 当前路由项的编码, 编码值自定义
    code?: string;
    // 当前模块是否是alpha阶段
    alpha?: AlphaCondition;
  }
}

/**
 *  菜单风格
 *  - `cubed`(默认): 图标和文字上下堆叠
 *  - `tiled`: 图标和文字平铺在同一行中
 *  - `none`: 不显示菜单
 */
export type MenuStyle = "cubed" | "tiled" | "none";
