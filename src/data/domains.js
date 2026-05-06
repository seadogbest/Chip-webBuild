import carHeroImage from "../assets/car.jpg";
import domain48vCarImage from "../assets/domain-48v-car.jpg";
import domainadasCarImage from "../assets/domain-adas-car.jpg";
import domainBodyPowerCarImage from "../assets/domain-bodypower-car.jpg";
import domainLEDCarImage from "../assets/domain-LED-car.jpg";
import domainChassisCarImage from "../assets/domain-chassis-car.jpg";
import domainPowerCarImage from "../assets/domain-power-car.jpg";
import domainThermalCarImage from "../assets/domain-thermal-car.jpg";
import domainPowerChainCarImage from "../assets/domain-powertrain-car.jpg";
import domainInfotainmentCarImage from "../assets/domain-infotainment-car.jpg";
import domainLightEVCarImage from "../assets/domain-lightev-car.jpg";

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
    cover: domain48vCarImage,
    coverHint: "建议放置 16:9 的 48V 系统示意图（1200x675）",
    subsystems: [
      "曲轴启动发电机 48V-逆变器 ISG",
      "区域 DC-DC 转换器 48V-12V",
      "传动系统启动发电机 48V-逆变器 ISG"
    ],
    functions: ["48V Energy Flow", "ISG Control", "Dual DC-DC Management"],
    subsystemDetails: {}
  },
  {
    key: "domain-adas",
    title: "高级驾驶员辅助系统 (ADAS)和自动驾驶(AD)",
    summary: "感知、域控、座舱融合的智能驾驶场景入口。",
    cover: domainadasCarImage,
    coverHint: "建议放置 ADAS 传感器融合图（1200x675）",
    subsystems: [
      "汽车雷达系统",
      "用于 ADAS 和自动驾驶的域控制器",
      "车内传感应用(ICMS)",
      "多用途相机",
      "智能座舱控制器",
      "L2，L3智能驾驶控制器"
    ],
    functions: ["77GHz Radar", "Perception Fusion", "L2/L3 Domain Decision"],
    subsystemDetails: {
      汽车雷达系统: ["24 GHz汽车雷达系统", "77 GHz汽车雷达系统"]
    }
  },
  {
    key: "domain-body-power",
    title: "汽车车身电子与电力分配",
    summary: "覆盖车身控制、区域网关与整车配电链路。",
    cover: domainBodyPowerCarImage,
    coverHint: "建议放置车身电子拓扑图（1200x675）",
    subsystems: ["汽车辅助系统", "汽车配电系统", "车身控制模块 (BCM)", "舒适便捷电子产品"],
    functions: ["Smart Window Control", "Zonal Gateway", "Power Distribution Logic"],
    subsystemDetails: {
      汽车辅助系统: ["辅助电机控制-12VDC 电机控制器", "汽车48V辅助电机驱动", "CAV 液压管理系统", "CAV 气动管理系统"],
      汽车配电系统: ["汽车一次配电单元", "汽车二次配电单元"],
      "车身控制模块 (BCM)": ["汽车车身控制模块 (BCM)", "带集成网关的车身控制模块 (BCM)"],
      舒适便捷电子产品: [
        "去中心化的镜子模块",
        "门控模块",
        "带内部和环境光控制功能的车顶控制模块",
        "座椅舒适度模块",
        "座椅控制模块",
        "智能汽车门禁",
        "智能闭锁系统",
        "智能车窗升降模块",
        "挡风玻璃雨刮器系统"
      ]
    },
    solutionProviders: {
      汽车48V辅助电机驱动: {
        name: "金脉电子",
        url: "http://www.g-pulse.com.cn/#/"
      }
    }
  },
  {
    key: "domain-lighting",
    title: "汽车 LED 照明系统",
    summary: "从单灯功能到矩阵大灯，覆盖内外饰照明控制。",
    cover: domainLEDCarImage,
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
    functions: ["Matrix Headlamp Driver", "Ambient Light Control", "Animated Tail-light"],
    subsystemDetails: {}
  },
  {
    key: "domain-chassis",
    title: "底盘控制与安全",
    summary: "制动、转向、悬架与约束系统的高可靠方案入口。",
    cover: domainChassisCarImage,
    coverHint: "建议放置底盘控制结构图（1200x675）",
    subsystems: ["汽车制动解决方案", "汽车转向解决方案"],
    functions: ["Electric Power Steering", "Brake-by-Wire", "Safety Trigger Logic"],
    subsystemDetails: {
      汽车制动解决方案: ["电动制动助力器", "电动驻车制动器", "机电制动系统(EMB)", "电子稳定控制"],
      汽车转向解决方案: ["电动助力转向(EPS)", "24v电子助力转向带主动转向", "线控转向"]
    }
  },
  {
    key: "domain-nev-powertrain",
    title: "新能源汽车动力系统",
    summary: "电池、逆变、车载充电和燃料电池传动一体化。",
    cover: domainPowerCarImage,
    coverHint: "建议放置新能源动力链路图（1200x675）",
    subsystems: ["汽车电池管理系统", "EV 逆变器", "电动汽车电源转换和车载充电器", "燃料电池电动汽车 (FCEV)传动系统"],
    functions: ["Battery Cell Monitoring", "OBC Control", "EV Inverter Drive"],
    subsystemDetails: {
      汽车电池管理系统: [
        "汽车电池监控和平衡",
        "汽车电池控制单元(BCU)",
        "汽车电池隔离通信",
        "汽车12V-24V电池管理系统(BMS)",
        "汽车48V电池管理系统(BMS)",
        "汽车电池管理系统(BMS)-高电压",
        "汽车电池组监控",
        "汽车电池护照和事件记录",
        "汽车电池保护和断开连接",
        "汽车电流传感和库仑计量",
        "BMS(两轮车和三轮车)"
      ],
      "EV 逆变器": [
        "电动汽车辅助逆变器",
        "适用于建筑、商用和农用车辆的高压辅助应用",
        "电动汽车牵引逆变器",
        "牵引逆变器(商用车)",
        "牵引逆变器(两轮车和三轮车)"
      ],
      电动汽车电源转换和车载充电器: [
        "用于电动汽车的高压DC-DC 转换器",
        "高压DC-DC转换器(商用车)",
        "电动汽车充电连接",
        "车载充电(电动商用车)",
        "车载充电(OBC)",
        "电动两轮车和三轮车的车载充电 (OBC)解决方案"
      ],
      "燃料电池电动汽车 (FCEV)传动系统": ["燃料电池控制单元(FCCU)", "燃料电池DC-DC升压转换器", "燃料电池电动空气压缩机"]
    },
    solutionProviders: {
      电动汽车辅助逆变器: {
        name: "金脉电子",
        url: "http://www.g-pulse.com.cn/#/"
      }
    }
  },
  {
    key: "domain-thermal",
    title: "电动汽车热管理",
    summary: "通过压缩机、PTC 与 HVAC 协同提升整车热效率。",
    cover: domainThermalCarImage,
    coverHint: "建议放置热管理回路图（1200x675）",
    subsystems: ["汽车中的泵和风扇"],
    functions: ["HVAC Thermal Loop", "ITMS Coordination", "PTC Heating Control"],
    subsystemDetails: {
      "汽车中的泵和风扇": ["汽车电动泵和风扇 12V", "汽车电动泵和风扇 48V"]
    }
  },
  {
    key: "domain-powertrain",
    title: "动力总成系统",
    summary: "发动机与传动系统协同控制的核心链路。",
    cover: domainPowerChainCarImage,
    coverHint: "建议放置动力总成示意图（1200x675）",
    subsystems: ["发动机控制单元", "变速箱控制器", "动力总成能量管理模块"],
    functions: ["Engine Control", "Shift Strategy", "Powertrain Coordination"],
    subsystemDetails: {}
  },
  {
    key: "domain-infotainment",
    title: "车载信息娱乐系统和人机界面",
    summary: "多屏交互、语音交互与车载连接融合体验。",
    cover: domainInfotainmentCarImage,
    coverHint: "建议放置座舱交互界面图（1200x675）",
    subsystems: ["汽车 USB-C电源和数据解决方案", "舱内无线充电"],
    functions: ["Multi-screen HMI", "Voice Interaction", "In-vehicle Connectivity"],
    subsystemDetails: {
      "汽车 USB-C电源和数据解决方案": ["汽车 USB 供电 - 主机", "汽车 USB Type-C 供电 （PD）", "USB-C 后座娱乐系统"],
      舱内无线充电: ["全套无线充电系统 (WLC)-集成", "无线充电系统 (WLC)-离散式"]
    }
  },
  {
    key: "domain-light-ev",
    title: "轻型电动车解决方案",
    summary: "适配两轮/三轮平台的电驱、充电与照明控制场景。",
    cover: domainLightEVCarImage,
    coverHint: "建议放置轻型电动车整车图（1200x675）",
    subsystems: ["两轮车和三轮车解决方案"],
    functions: ["Light EV Drive", "Low-voltage BMS", "Lighting Communication"],
    subsystemDetails: {
      两轮车和三轮车解决方案: [
        "BMS （两轮车和三轮BMS）",
        "LED 驱动器（两轮车和三轮车）",
        "智能仪表盘（两轮车和三轮车）",
        "牵引逆变器（两轮车和三轮车）",
        "车载充电OBC（两轮车和三轮车）"
      ]
    }
  }
];
