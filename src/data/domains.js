import carHeroImage from "../assets/car.jpg";
import domainadasCarImage from "../assets/domain-adas-car.jpg";
import domainBodyPowerCarImage from "../assets/domain-bodypower-car.jpg";
import domainChassisCarImage from "../assets/domain-chassis-car.jpg";
import domainPowerCarImage from "../assets/domain-power-car.jpg";
import domainInfotainmentCarImage from "../assets/domain-infotainment-car.jpg";

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
    key: "powertrain",
    title: "动力域 Powertrain",
    summary: "动力输出、扭矩分配和能源管理，覆盖电机控制、电池管理与充电管理。",
    cover: domainPowerCarImage,
    coverHint: "建议放置 16:9 的动力域系统示意图（1200x675）",
    subsystems: [
      "电池管理系统（BMS）",
      "电机控制器 / 电驱系统",
      "充电与电源转换",
      "燃料电池系统（FCEV）",
      "热管理（泵与风扇）",
      "整车控制器（VCU）"
    ],
    functions: ["Battery Management", "Motor Control", "Charging Management", "Thermal Management"],
    subsystemDetails: {
      "电池管理系统（BMS）": [
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
      "电机控制器 / 电驱系统": [
        "电动汽车辅助逆变器",
        "适用于建筑、商用和农用车辆的高压辅助应用",
        "电动汽车牵引逆变器",
        "牵引逆变器(商用车)",
        "牵引逆变器(两轮车和三轮车)"
      ],
      "充电与电源转换": [
        "用于电动汽车的高压DC-DC 转换器",
        "高压DC-DC转换器(商用车)",
        "电动汽车充电连接",
        "车载充电(电动商用车)",
        "车载充电(OBC)",
        "电动两轮车和三轮车的车载充电 (OBC)解决方案",
        "区域 DC-DC 转换器 48V-12V"
      ],
      "燃料电池系统（FCEV）": [
        "燃料电池控制单元(FCCU)",
        "燃料电池DC-DC升压转换器",
        "燃料电池电动空气压缩机"
      ],
      "热管理（泵与风扇）": ["汽车电动泵和风扇 12V", "汽车电动泵和风扇 48V"]
    },
    // 框图方案统一走 subsystemDiagrams 轮播配置：每张框图自带提供单位（provider）。
    // detail 字段（可选）用于把框图绑定到具体的三级详情项；不填则在整个子系统下展示。
    subsystemDiagrams: {
      "电机控制器 / 电驱系统": [
        {
          id: "aux-inverter",
          svgKey: "aux-inverter",
          detail: "电动汽车辅助逆变器",
          label: "电动汽车辅助逆变器框图",
          provider: {
            name: "金脉电子",
            url: "http://www.g-pulse.com.cn/#/"
          }
        }
      ]
    }
  },
  {
    key: "chassis",
    title: "底盘域 Chassis",
    summary: "转向、制动、悬架及车辆姿态控制。",
    cover: domainChassisCarImage,
    coverHint: "建议放置底盘控制结构图（1200x675）",
    subsystems: ["转向系统", "制动系统", "悬架系统"],
    functions: ["Electric Power Steering", "Brake-by-Wire", "Suspension Control"],
    subsystemDetails: {
      转向系统: ["电动助力转向(EPS)", "24v电子助力转向带主动转向", "线控转向"],
      制动系统: ["电动制动助力器", "电动驻车制动器", "机电制动系统(EMB)", "电子稳定控制"]
    }
  },
  {
    key: "body",
    title: "车身域 Body",
    summary: "车身电器、舒适和便利功能，覆盖 BCM、车门、车窗、灯光、门锁与座椅等。",
    cover: domainBodyPowerCarImage,
    coverHint: "建议放置车身电子拓扑图（1200x675）",
    subsystems: [
      "车身控制模块（BCM）",
      "车门与门锁系统",
      "车窗与车顶系统",
      "灯光系统",
      "雨刮与辅助系统",
      "座椅系统",
      "汽车配电系统"
    ],
    functions: ["Body Control", "Door & Lock", "Lighting Control", "Seat & Comfort", "Power Distribution"],
    subsystemDetails: {
      "车身控制模块（BCM）": ["汽车车身控制模块 (BCM)", "带集成网关的车身控制模块 (BCM)"],
      "车门与门锁系统": ["门控模块", "智能汽车门禁", "智能闭锁系统", "去中心化的镜子模块"],
      "车窗与车顶系统": ["智能车窗升降模块", "带内部和环境光控制功能的车顶控制模块"],
      灯光系统: ["LED 驱动器（两轮车和三轮车）"],
      "雨刮与辅助系统": ["挡风玻璃雨刮器系统", "辅助电机控制-12VDC 电机控制器", "CAV 液压管理系统", "CAV 气动管理系统"],
      座椅系统: ["座椅控制模块", "座椅舒适度模块"],
      汽车配电系统: ["汽车一次配电单元", "汽车二次配电单元"]
    }
  },
  {
    key: "cockpit",
    title: "座舱域 Cockpit",
    summary: "人机交互、信息显示和娱乐，覆盖中控车机、仪表与无线充电等。",
    cover: domainInfotainmentCarImage,
    coverHint: "建议放置座舱交互界面图（1200x675）",
    subsystems: ["信息娱乐主机（IVI）", "仪表与显示", "舱内无线充电", "音响与语音交互"],
    functions: ["Multi-screen HMI", "Voice Interaction", "In-vehicle Connectivity"],
    subsystemDetails: {
      // 信息娱乐主机（IVI）暂不划分三级可选详情：现有框图（主机/蓝牙/蓝牙钥匙）与 USB 供电等条目无对应关系，
      // 待有与三级条目一一对应的方案材料后再启用。
      舱内无线充电: ["全套无线充电系统 (WLC)-集成", "无线充电系统 (WLC)-离散式"],
      仪表与显示: ["智能仪表盘（两轮车和三轮车）"]
    },
    subsystemDiagrams: {
      "信息娱乐主机（IVI）": [
        {
          id: "ivi-main",
          svgKey: "ivi",
          label: "IVI 主机框图",
          provider: { name: "芯力特", url: "https://www.sitcores.com/" }
        },
        {
          id: "ivi-bluetooth",
          svgKey: "ivi-bluetooth",
          label: "蓝牙模块框图",
          provider: { name: "芯力特", url: "https://www.sitcores.com/" }
        },
        {
          id: "ivi-ai-demo",
          svgKey: "ivi-ai-demo",
          label: "蓝牙钥匙主模块框图",
          provider: { name: "东风研发总院", url: "https://www.dfmc.com.cn/index.html" }
        }
      ]
    }
  },
  {
    key: "adas",
    title: "智能驾驶域 ADAS/AD",
    summary: "环境感知、驾驶决策和辅助驾驶，覆盖雷达、视觉与域控制。",
    cover: domainadasCarImage,
    coverHint: "建议放置 ADAS 传感器融合图（1200x675）",
    subsystems: ["雷达系统", "摄像头 / 视觉系统", "智能驾驶域控制器"],
    functions: ["77GHz Radar", "Perception Fusion", "L2/L3 Domain Decision"],
    subsystemDetails: {
      雷达系统: ["24 GHz汽车雷达系统", "77 GHz汽车雷达系统"]
    }
  }
];
