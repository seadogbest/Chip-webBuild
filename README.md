# Vue 3 + Vite
# 产品设计
网站主题：国产汽车芯片选型指南
参考页面：参考英飞凌官网的智能汽车选型方案的样式：https://www.infineon.cn/applications/automotive


# 其核心设计目标：
以 整车系统（System Domain） 为主线
将半导体产品映射到具体应用场景
降低从“需求 → 方案 → 器件”的认知路径

# 设计思路：
1. 信息架构（Information Architecture）

页面采用典型的三层结构：
1.1 第一层：系统级分类（Domain Level）

按整车功能域划分：
（1）用于电动汽车&轻度混合动力汽车的48V系统
（2）高级驾驶员辅助系统 (ADAS)和自动驾驶(AD)
（3）汽车车身电子与电力分配
（4）汽车 LED 照明系统
（5）底盘控制与安全
（6）新能源汽车动力系统
（7）电动汽车热管理
（8）动力总成系统
（9）车载信息娱乐系统和人机界面
（10）轻型电动车解决方案


1.2 第二层：子系统（Subsystem Level）
每个 Domain 下进一步拆分为具体子系统
条目如下：
用于电动汽车&轻度混合动力汽车的48V系统
{
    曲轴启动发电机 48V-逆变器 ISG,
    区域 DC-DC 转换器 48V-12V,
    传动系统启动发电机 48V-逆变器 ISG
}
高级驾驶员辅助系统 (ADAS)和自动驾驶(AD)
{
    汽车雷达系统
    用于 ADAS 和自动驾驶的域控制器,
    车内传感应用(ICMS)，
    多用途相机，
    智能座舱控制器，
    L2，L3智能驾驶控制器
}
汽车车身电子与电力分配
{
    汽车辅助系统，
    车载网关，
    汽车配电系统，
    车身控制模块 (BCM)，
    舒适便捷电子产品，
    区域 DC-DC 转换器 48V-12V，
    区域控制器
}
汽车 LED 照明系统
{
    汽车动画LED系统，
    单灯功能-单通道 LED 驱动器，
    汽车LED尾灯功能，
    全LED大灯系统-多通道LED驱动器，
    LED 驱动器(电动两轮车和三轮车)，
    LED 像系灯控制器-供电和通信，
    静态室内氛围 LED 灯
}
底盘控制与安全
{
    主动悬架控制，
    安全气囊系统，
    汽车制动解决方案，
    汽车转向解决方案，
    底盘域控制，
    可逆安全带预紧器
}
新能源汽车动力系统
{
    汽车电池管理系统，
    电动汽车充电，
    EV 逆变器，
    电动汽车电源转换和车载充电器，
    燃料电池电动汽车 (FCEV)传动系统
}
电动汽车热管理
{
    汽车高压电动压缩机，
    汽车集成热管理系统(ITMS)，
    汽车高压 PTC 加热器模块，
    汽车中的泵和风扇，
    汽车暖通空调控制模块
}

这里的要求是 点击第一层：系统级分类（Domain Level）后，会跳转到新页面，显示对应的第二层：子系统（Subsystem Level）

## 图片接入操作手顺（Vue 3 + Vite）

### 1) 图片位说明（已在页面预留）

- 首页 Hero 主视觉图：`src/data/domains.js` 中 `homepageImage`
- Domain 卡片图：`src/data/domains.js` 每个 Domain 的 `cover`
- Domain 详情页头图：复用对应 Domain 的 `cover`
- 图片说明文案：每个 Domain 的 `coverHint`

### 2) 准备图片文件

- 建议统一放到：`src/assets/images/`
- 建议命名：`domain-adas.webp`、`domain-48v.webp`、`domain-thermal.webp`
- 建议尺寸：16:9，推荐 `1200x675`
- 建议格式：`webp`（优先）/ `jpg`

### 3) 在代码中导入图片

在 `src/data/domains.js` 顶部增加导入：

```js
import adasImage from "../assets/images/domain-adas.webp";
import hybrid48vImage from "../assets/images/domain-48v.webp";
```

### 4) 绑定到对应 Domain

将对应 Domain 的 `cover` 从空字符串改为导入变量：

```js
{
  key: "domain-adas",
  title: "高级驾驶员辅助系统 (ADAS)和自动驾驶(AD)",
  cover: adasImage,
  coverHint: "建议放置 ADAS 传感器融合图（1200x675）",
  subsystems: [...]
}
```

### 5) 更换首页主视觉图

修改 `homepageImage`：

```js
export const homepageImage = {
  src: hybrid48vImage,
  alt: "48V 系统主视觉图"
};
```

### 6) 运行和检查

```bash
npm install
npm run dev
```

进入首页后检查：

- Domain 卡片是否显示图片
- 点击 Domain 是否跳转到新页面
- 详情页头图是否正确显示

### 7) 常见问题排查

- 图片不显示：确认路径是否在 `src/assets/images/` 且导入路径正确
- 图片拉伸：确认素材比例为 16:9，页面已使用 `object-fit: cover`
- 只想先占位不放图：保留 `cover: ""`，页面会自动显示预留提示块

