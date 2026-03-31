import carHeroImage from "../assets/car.jpg";

export const siteMeta = {
  title: "国产汽车芯片选型指南",
  subtitle: "应用驱动型产品选型入口",
  slogan: "clean / safe / smart",
  reference: "参考英飞凌 Automotive 页面信息架构"
};

export const homepageImage = {
  src: carHeroImage,
  alt: "国产汽车芯片选型平台主视觉图"
};

export const domains = [
  {
    key: "domain-48v",
    title: "用于电动汽车&轻度混合动力汽车的48V系统",
    summary: "围绕 48V 起发一体、DC-DC 与能量回收构建轻混系统选型入口。",
    cover: "",
    coverHint: "建议放置 16:9 的 48V 系统示意图（1200x675）",
    subsystems: [
      "曲轴启动发电机 48V-逆变器 ISG",
      "区域 DC-DC 转换器 48V-12V",
      "传动系统启动发电机 48V-逆变器 ISG"
    ],
    functions: ["48V Energy Flow", "ISG Control", "Dual DC-DC Management"]
  },
  {
    key: "domain-adas",
    title: "高级驾驶员辅助系统 (ADAS)和自动驾驶(AD)",
    summary: "感知、域控、座舱融合的智能驾驶场景入口。",
    cover: "",
    coverHint: "建议放置 ADAS 传感器融合图（1200x675）",
    subsystems: [
      "汽车雷达系统",
      "用于 ADAS 和自动驾驶的域控制器",
      "车内传感应用(ICMS)",
      "多用途相机",
      "智能座舱控制器",
      "L2，L3智能驾驶控制器"
    ],
    functions: ["77GHz Radar", "Perception Fusion", "L2/L3 Domain Decision"]
  },
  {
    key: "domain-body-power",
    title: "汽车车身电子与电力分配",
    summary: "覆盖车身控制、区域网关与整车配电链路。",
    cover: "",
    coverHint: "建议放置车身电子拓扑图（1200x675）",
    subsystems: [
      "汽车辅助系统",
      "车载网关",
      "汽车配电系统",
      "车身控制模块 (BCM)",
      "舒适便捷电子产品",
      "区域 DC-DC 转换器 48V-12V",
      "区域控制器"
    ],
    functions: ["Smart Window Control", "Zonal Gateway", "Power Distribution Logic"]
  },
  {
    key: "domain-lighting",
    title: "汽车 LED 照明系统",
    summary: "从单灯功能到矩阵大灯，覆盖内外饰照明控制。",
    cover: "",
    coverHint: "建议放置车灯控制效果图（1200x675）",
    subsystems: [
      "汽车动画LED系统",
      "单灯功能-单通道 LED 驱动器",
      "汽车LED尾灯功能",
      "全LED大灯系统-多通道LED驱动器",
      "LED 驱动器(电动两轮车和三轮车)",
      "LED 像系灯控制器-供电和通信",
      "静态室内氛围 LED 灯"
    ],
    functions: ["Matrix Headlamp Driver", "Ambient Light Control", "Animated Tail-light"]
  },
  {
    key: "domain-chassis",
    title: "底盘控制与安全",
    summary: "制动、转向、悬架与约束系统的高可靠方案入口。",
    cover: "",
    coverHint: "建议放置底盘控制结构图（1200x675）",
    subsystems: [
      "主动悬架控制",
      "安全气囊系统",
      "汽车制动解决方案",
      "汽车转向解决方案",
      "底盘域控制",
      "可逆安全带预紧器"
    ],
    functions: ["Electric Power Steering", "Brake-by-Wire", "Safety Trigger Logic"]
  },
  {
    key: "domain-nev-powertrain",
    title: "新能源汽车动力系统",
    summary: "电池、逆变、车载充电和燃料电池传动一体化。",
    cover: "",
    coverHint: "建议放置新能源动力链路图（1200x675）",
    subsystems: [
      "汽车电池管理系统",
      "电动汽车充电",
      "EV 逆变器",
      "电动汽车电源转换和车载充电器",
      "燃料电池电动汽车 (FCEV)传动系统"
    ],
    functions: ["Battery Cell Monitoring", "OBC Control", "EV Inverter Drive"]
  },
  {
    key: "domain-thermal",
    title: "电动汽车热管理",
    summary: "通过压缩机、PTC 与 HVAC 协同提升整车热效率。",
    cover: "",
    coverHint: "建议放置热管理回路图（1200x675）",
    subsystems: [
      "汽车高压电动压缩机",
      "汽车集成热管理系统(ITMS)",
      "汽车高压 PTC 加热器模块",
      "汽车中的泵和风扇",
      "汽车暖通空调控制模块"
    ],
    functions: ["HVAC Thermal Loop", "ITMS Coordination", "PTC Heating Control"]
  },
  {
    key: "domain-powertrain",
    title: "动力总成系统",
    summary: "发动机与传动系统协同控制的核心链路。",
    cover: "",
    coverHint: "建议放置动力总成示意图（1200x675）",
    subsystems: ["发动机控制单元", "变速箱控制器", "动力总成能量管理模块"],
    functions: ["Engine Control", "Shift Strategy", "Powertrain Coordination"]
  },
  {
    key: "domain-infotainment",
    title: "车载信息娱乐系统和人机界面",
    summary: "多屏交互、语音交互与车载连接融合体验。",
    cover: "",
    coverHint: "建议放置座舱交互界面图（1200x675）",
    subsystems: ["座舱域控制器", "多媒体主机", "语音与触控交互单元", "车载连接模块"],
    functions: ["Multi-screen HMI", "Voice Interaction", "In-vehicle Connectivity"]
  },
  {
    key: "domain-light-ev",
    title: "轻型电动车解决方案",
    summary: "适配两轮/三轮平台的电驱、充电与照明控制场景。",
    cover: "",
    coverHint: "建议放置轻型电动车整车图（1200x675）",
    subsystems: ["轻型电驱控制器", "电池与充电管理", "照明驱动与通信", "车身控制单元"],
    functions: ["Light EV Drive", "Low-voltage BMS", "Lighting Communication"]
  }
];
