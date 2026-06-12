# src 代码结构与运行流程说明

本文档用于说明当前项目 `src` 目录的代码组织方式，以及“从用户访问页面到界面渲染出来”的整体运行流程。

## 1. 项目定位

当前项目是一个基于 Vue 3 + Vue Router + Vite 的单页应用，主题是“国产汽车芯片选型指南”。

项目整体采用“数据驱动页面”的实现方式：

- 路由决定当前展示哪个页面
- 页面组件决定当前展示哪些区域和交互
- `src/data/domains.js` 统一提供页面所需的业务数据
- `src/assets/` 提供图片和 SVG 等静态资源

## 2. src 目录结构

```text
src
├── App.vue
├── main.js
├── style.css
├── assets/
├── components/
│   └── HelloWorld.vue
├── data/
│   └── domains.js
├── pages/
│   ├── DomainDetailPage.vue
│   └── DomainHomePage.vue
└── router/
    └── index.js
```

## 3. 每个目录和文件是做什么的

### 3.1 main.js

`src/main.js` 是应用入口文件，负责完成 4 件事：

1. 引入 Vue 的 `createApp`
2. 引入根组件 `App.vue`
3. 引入路由 `router`
4. 引入全局样式 `style.css`

最后执行：

```js
createApp(App).use(router).mount("#app");
```

这行代码的含义是：

- 创建 Vue 应用实例
- 把路由系统挂载到应用上
- 把整个应用渲染到 `index.html` 中的 `#app` 节点

可以把它理解成“前端应用启动开关”。

### 3.2 App.vue

`src/App.vue` 是全局根组件，相当于整站的外层框架。

它主要承担两个职责：

- 渲染站点统一头部
- 通过 `<RouterView />` 作为页面出口，显示当前路由对应的页面组件

这里的头部内容并不是写死在模板里的，而是从 `src/data/domains.js` 里的 `siteMeta` 读取的，比如：

- 站点标题
- 副标题
- slogan
- 参考信息

因此 `App.vue` 更像“全站壳子”。

### 3.3 router/index.js

`src/router/index.js` 负责定义页面访问路径和页面组件之间的映射关系。

当前有两个主要路由：

- `/`
  - 首页
  - 对应 `DomainHomePage.vue`
- `/domain/:domainKey`
  - 领域详情页
  - 对应 `DomainDetailPage.vue`

其中 `:domainKey` 是动态参数，例如：

- `/domain/domain-adas`
- `/domain/domain-body-power`

页面会根据这个参数去查找当前选中的业务领域数据。

### 3.4 data/domains.js

`src/data/domains.js` 是当前项目最核心的业务数据文件，可以把它理解为“内容中心”或“数据仓”。

这个文件主要导出了 3 类数据：

#### siteMeta

用于页面头部和站点信息展示，例如：

- title
- subtitle
- slogan
- reference

#### homepageImage

用于首页主视觉图片展示。

#### domains

这是最重要的数据数组，描述了所有系统领域（Domain）的内容。

每个 domain 通常包含这些字段：

- `key`
  - 当前领域的唯一标识
  - 同时也是详情页路由参数
- `title`
  - 领域标题
- `summary`
  - 领域简介
- `cover`
  - 领域封面图
- `coverHint`
  - 无图时的说明文案
- `subsystems`
  - 子系统列表
- `functions`
  - 功能模块列表
- `subsystemDetails`
  - 子系统对应的更细粒度详情项
- `solutionProviders`
  - 某些详情项对应的企业/方案提供方信息

整个站点页面内容基本都是围绕这份数据渲染出来的，所以后续如果新增领域、替换文案、增加子系统，优先修改这里即可。

### 3.5 pages/DomainHomePage.vue

`src/pages/DomainHomePage.vue` 是首页组件。

它主要做了三件事：

#### 1）读取首页需要的数据

从 `domains.js` 引入：

- `domains`
- `homepageImage`
- `siteMeta`

#### 2）做首页统计计算

页面通过 `computed` 计算：

- 系统领域总数
- 子系统总数
- 功能模块总数

这些统计值显示在首页 Hero 区域的指标卡片中。

#### 3）渲染所有 Domain 卡片

页面会遍历 `domains`，生成一组系统领域卡片，卡片里包含：

- 图片
- 标题
- 简介
- 子系统数量
- “查看子系统”按钮

当用户点击按钮时，会通过 `RouterLink` 进入 `/domain/:domainKey` 对应的详情页。

因此首页本质上是“系统领域总览页”。

### 3.6 pages/DomainDetailPage.vue

`src/pages/DomainDetailPage.vue` 是当前项目最核心的业务页面，也是逻辑最复杂的文件。

这个页面的职责可以拆成几部分：

#### 1）根据路由参数找到当前领域

页面通过 `useRoute()` 拿到 `domainKey`，再从 `domains` 中查找当前激活的领域数据。

如果找不到对应数据，就显示“未找到该 Domain”的空状态页面。

#### 2）管理当前选中的子系统和详情项

页面内部通过 `ref` 和 `computed` 管理：

- 当前选中的子系统 `selectedSubsystem`
- 当前选中的子系统详情 `selectedSubsystemDetail`
- 当前子系统下可选的详情列表
- 当前应该展示的封面图
- 当前应该展示的方案提供单位

也就是说，详情页并不是固定内容，而是根据“当前领域 + 当前子系统 + 当前详情项”实时切换展示内容。

#### 3）渲染子系统列表和右侧详情区域

页面下半部分是一个两栏布局：

- 左边：子系统列表
- 右边：当前子系统的详情区域

用户点击左边某个子系统时，页面会：

- 更新 `selectedSubsystem`
- 自动切换默认详情项
- 更新顶部图示区域
- 更新右侧的方案信息区域

如果某个子系统配置了 `subsystemDetails`，右侧还会出现“可选详情”按钮组，让用户继续切换更细一级的内容。

#### 4）生成默认封面图

当某个子系统没有单独配置专门图片时，页面会调用 `buildSubsystemCover()` 动态生成一张 SVG 数据图，作为顶部展示图。

这样做的好处是：

- 不依赖每个子系统都准备图片
- 页面视觉上不会空缺
- 每个子系统切换时都会有对应的标题图

#### 5）特殊 SVG 框图交互

当前详情页中有一个特殊分支：

- 当领域为“汽车车身电子与电力分配”
- 且子系统为“汽车辅助系统”
- 且详情项为“汽车48V辅助电机驱动”

这时顶部不再展示普通封面图，而是展示一个交互式 SVG 框图。

该功能由以下几部分组成：

- `diagram48vSvg`
  - 直接把 SVG 文件原始内容导入进来
- `diagramNodes`
  - 定义框图中每个热点区域对应的芯片信息
- `diagramHotspotSelectorMap`
  - 把 SVG 图中的图形节点和业务热点 ID 映射起来
- `setupSvgHotspots()`
  - 给 SVG 中的特定元素添加可点击能力
- `handleSvgClick()` / `handleSvgKeyboard()`
  - 处理鼠标点击和键盘交互

用户点击框图热点后，右侧会同步切换当前芯片列表。

这部分说明当前项目除了基础页面展示外，也开始承载“可视化框图选型”的交互能力。

### 3.7 style.css

`src/style.css` 是全局样式文件。

它主要负责：

- 全站基础字体和颜色
- 页面背景
- 容器宽度
- 头部样式
- 通用卡片样式
- 通用按钮样式
- 基础表单样式
- 响应式布局规则

可以把它理解为“全站公共视觉基础层”。

而页面组件中的 `<style scoped>` 更偏向页面自己的局部样式。

### 3.8 assets/

`src/assets/` 用来存放静态资源，当前主要包括：

- 首页主图
- 各个领域的封面图
- 一个原始 SVG 框图文件
- Vue 默认示例资源

这些资源通常会被：

- `domains.js` 导入后作为数据字段使用
- `DomainDetailPage.vue` 直接导入原始 SVG 内容使用

### 3.9 components/HelloWorld.vue

`src/components/HelloWorld.vue` 是 Vue/Vite 初始化时自带的示例组件。

当前项目中没有实际引用它，所以它不参与当前页面渲染流程。

可以把它理解为：

- 保留下来的模板示例文件
- 当前业务无直接关系

如果后续确认不再使用，可以删除。

## 4. 从用户访问流程看，这套代码是怎么跑起来的

下面按“用户打开页面”的真实顺序来说明。

### 第一步：用户访问站点

用户在浏览器访问站点地址，例如：

- 首页地址：`/`
- 详情页地址：`/domain/domain-adas`

浏览器首先会加载项目构建后的入口 HTML 文件，也就是 Vite 产出的 `index.html`。

这个 HTML 里会有一个根节点：

```html
<div id="app"></div>
```

Vue 应用最终就是挂载到这里。

### 第二步：浏览器执行前端入口 main.js

页面脚本加载后，首先执行 `src/main.js`。

它会：

- 创建 Vue 应用
- 注入路由
- 注入全局样式
- 挂载到 `#app`

到这里，应用真正启动。

### 第三步：加载根组件 App.vue

Vue 启动后会先渲染 `App.vue`。

`App.vue` 会先显示站点公共头部，然后渲染：

```vue
<RouterView />
```

这里可以把 `RouterView` 理解为“当前页面占位符”。

真正显示哪个页面，取决于当前 URL。

### 第四步：router 根据 URL 决定显示哪个页面

路由系统会读取当前浏览器地址：

- 如果是 `/`，就显示 `DomainHomePage.vue`
- 如果是 `/domain/:domainKey`，就显示 `DomainDetailPage.vue`

因此用户看到首页还是详情页，并不是 `App.vue` 自己决定的，而是 `router/index.js` 决定的。

### 第五步：首页的运行流程

如果当前地址是 `/`，会进入首页组件 `DomainHomePage.vue`。

它的运行过程是：

1. 从 `domains.js` 读取站点信息、首页图片、领域列表
2. 通过 `computed` 统计总领域数、总子系统数、总功能数
3. 渲染 Hero 区和指标卡
4. 遍历 `domains` 渲染每一个领域卡片
5. 用户点击某个卡片上的“查看子系统”按钮
6. 路由跳转到 `/domain/xxx`

这时页面不会整页刷新，而是由 Vue Router 在前端切换页面组件。

### 第六步：详情页的运行流程

如果当前地址是 `/domain/:domainKey`，会进入 `DomainDetailPage.vue`。

它的运行过程是：

1. 通过 `useRoute()` 读取当前 URL 中的 `domainKey`
2. 在 `domains` 数组中找到对应领域对象
3. 如果找不到，显示空状态
4. 如果找到，自动选中该领域的第一个子系统
5. 同时自动选中该子系统的默认详情项（如果有）
6. 根据当前选择，计算顶部展示图、右侧详情文案、方案单位信息
7. 渲染左侧子系统列表和右侧详情区域

这就是为什么用户一进入详情页时，页面已经有默认选中的内容，而不是空白状态。

### 第七步：用户切换子系统时发生什么

当用户点击左侧某个子系统按钮时：

1. `chooseSubsystem(subsystem)` 被触发
2. 更新 `selectedSubsystem`
3. 根据该子系统自动选择一个默认详情项
4. 相关 `computed` 值自动重新计算
5. 顶部封面图更新
6. 右侧详情项列表更新
7. 方案提供单位区域更新

由于 Vue 的响应式机制，开发者不需要手动操作 DOM，数据变了，界面会自动刷新。

### 第八步：用户切换详情项时发生什么

如果当前子系统下还有更细一级的详情项，用户点击右侧的详情按钮时：

1. `chooseSubsystemDetail(detail)` 被触发
2. 更新 `selectedSubsystemDetail`
3. 页面重新计算当前显示标题、封面、方案单位
4. 顶部图示区域同步切换

这就是当前项目“第二层子系统”和“第三层详情项”联动的核心实现方式。

### 第九步：特殊 SVG 框图是怎么工作的

当用户切换到“汽车48V辅助电机驱动”这个特殊详情项时：

1. `shouldShowBodyPower48vDiagram` 计算结果变成 `true`
2. 页面不再渲染普通图片，而改为渲染原始 SVG 框图
3. `setupSvgHotspots()` 在 SVG 内部查找指定元素
4. 给这些元素补充热点 class、无障碍属性和业务 ID
5. 用户点击热点时，触发 `handleSvgClick()`
6. 当前选中的芯片节点 ID 更新
7. 右侧芯片卡片列表同步切换

也就是说，这部分不是单纯展示一张图，而是“图和数据联动”的交互式区域。

### 第十步：页面样式如何生效

样式分两层：

- `src/style.css`
  - 提供全局基础样式
- 各页面 `.vue` 文件中的 `<style scoped>`
  - 只作用于当前页面组件

这样做的好处是：

- 全站通用样式统一管理
- 页面细节样式局部隔离
- 避免样式互相污染

## 5. 当前这套结构的优点

### 优点 1：数据和页面职责比较清晰

- `data/` 管业务内容
- `pages/` 管页面展示
- `router/` 管导航切换
- `assets/` 管资源

整体比较容易理解。

### 优点 2：新增领域成本低

如果只是新增一个新的系统领域，通常主要修改 `domains.js` 即可，页面组件本身不需要大量改动。

### 优点 3：适合继续扩展成选型平台

当前已经具备：

- 领域总览
- 子系统切换
- 详情项切换
- 企业信息展示
- SVG 热点交互

后续可以继续演进为更完整的产品选型平台。

## 6. 当前结构里值得注意的地方

### 1）DomainDetailPage.vue 已经比较重

目前很多逻辑都集中在 `DomainDetailPage.vue` 中，例如：

- 路由解析
- 子系统选择
- 详情项切换
- 封面图生成
- 方案单位展示
- SVG 热点交互

后续如果继续加更多框图和更多交互，建议把它拆成多个小组件，例如：

- `SubsystemList`
- `SubsystemDetailPanel`
- `ProviderCard`
- `InteractiveDiagramPanel`

### 2）HelloWorld.vue 是未使用示例文件

它现在不影响功能，但容易让后续维护者误以为它参与业务。

### 3）README.md 当前不是项目说明文档

当前仓库里的 `README.md` 更像是需求清单，而不是面向开发者的项目说明。如果后续要完善项目文档，建议：

- 保留当前需求记录
- 再单独整理标准 README

## 7. 一句话总结

这套代码可以理解为：

“一个以 `domains.js` 为业务数据核心、通过 Vue Router 切换首页和详情页、并在详情页中完成子系统与选型信息联动展示的 Vue 单页应用。”
