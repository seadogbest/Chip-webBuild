<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { domains } from "../data/domains";
import { chipRecords } from "../data/chip-records.generated";
import auxInverterDiagramSvg from "../assets/SVG/demo.svg?raw";
import iviDiagramSvg from "../assets/SVG/芯力特-IVI框图.svg?raw";
import bluetoothDiagramSvg from "../assets/SVG/芯力特-蓝牙框图.svg?raw";
import aiDemoDiagramSvg from "../assets/SVG/ai_demo.svg?raw";

const route = useRoute();
const selectedSubsystem = ref("");
const selectedSubsystemDetail = ref("");
const colorPalettes = [
  ["#0ea5e9", "#2563eb", "#1e40af"],
  ["#14b8a6", "#0d9488", "#0f766e"],
  ["#f59e0b", "#ea580c", "#c2410c"],
  ["#a855f7", "#7c3aed", "#5b21b6"],
  ["#22c55e", "#16a34a", "#15803d"],
  ["#ef4444", "#dc2626", "#991b1b"]
];

const activeDomain = computed(() => domains.find((item) => item.key === route.params.domainKey));
const validDomain = computed(() => Boolean(activeDomain.value));
const selectedSubsystemOptions = computed(() => {
  if (!activeDomain.value || !selectedSubsystem.value) {
    return [];
  }
  return activeDomain.value.subsystemDetails?.[selectedSubsystem.value] ?? [];
});
const selectedSubsystemDisplay = computed(() => selectedSubsystemDetail.value || selectedSubsystem.value);
// 框图方案统一数据驱动：subsystemDiagrams 中 slide.detail（可选）把框图绑定到三级详情，
// 未配置 detail 的框图在整个子系统下展示（如座舱域 IVI）
const activeSubsystemSlides = computed(() => {
  const slides = activeDomain.value?.subsystemDiagrams?.[selectedSubsystem.value] ?? [];
  return slides.filter((slide) => !slide.detail || slide.detail === selectedSubsystemDetail.value);
});
const shouldShowSubsystemDiagram = computed(() => activeSubsystemSlides.value.length > 0);
const diagramSvgMap = {
  ivi: iviDiagramSvg,
  "ivi-bluetooth": bluetoothDiagramSvg,
  "ivi-ai-demo": aiDemoDiagramSvg,
  "aux-inverter": auxInverterDiagramSvg
};
const activeSlideIndex = ref(0);
const activeSlide = computed(() => activeSubsystemSlides.value[activeSlideIndex.value] ?? null);
const activeSlideSvg = computed(() => diagramSvgMap[activeSlide.value?.svgKey] ?? "");

function prevSubsystemSlide() {
  const count = activeSubsystemSlides.value.length;
  if (!count) {
    return;
  }
  activeSlideIndex.value = (activeSlideIndex.value - 1 + count) % count;
}

function nextSubsystemSlide() {
  const count = activeSubsystemSlides.value.length;
  if (!count) {
    return;
  }
  activeSlideIndex.value = (activeSlideIndex.value + 1) % count;
}
const selectedSubsystemIndex = computed(() => {
  if (!activeDomain.value) {
    return 0;
  }
  const index = activeDomain.value.subsystems.indexOf(selectedSubsystem.value);
  return index >= 0 ? index : 0;
});
const selectedSubsystemCover = computed(() => {
  if (!activeDomain.value) {
    return "";
  }
  return buildSubsystemCover(selectedSubsystemDisplay.value, activeDomain.value.title, selectedSubsystemIndex.value);
});
// 方案提供单位与具体框图绑定：只有当前正在展示框图时，才返回该框图自带的提供单位
const selectedSolutionProvider = computed(() => {
  if (!shouldShowSubsystemDiagram.value) {
    return null;
  }
  return activeSlide.value?.provider ?? null;
});
/* ===== 电动汽车辅助逆变器框图（demo.svg）：可点击芯片节点（自带完整芯片清单，不查库） ===== */
const auxInverterChipNodes = [
  {
    id: "mcu",
    label: "MCU",
    x: 2.7,
    y: 31.2,
    w: 16.9,
    h: 58.2,
    chips: [
      {
        model: "THA6206F400B292NCA(CS)",
        series: "MCU",
        note: "主控可按算力、安全等级与成本选择。",
        url: "https://www.tsinghuaic.com/index/index/show/id/36?lang=zh-cn"
      }
    ]
  },
  {
    id: "pmic",
    label: "电源管理芯片",
    x: 4.7,
    y: 17.4,
    w: 14.8,
    h: 11.8,
    chips: [
      {
        model: "SA47301QJQ(CS)",
        series: "电源管理芯片",
        note: "用于电源管理与基础系统供电。",
        url: "https://www.silergy.com/productsview/SA47301QJQ"
      }
    ]
  },
  {
    id: "boost",
    label: "升压变换器",
    x: 37.5,
    y: 2.4,
    w: 13.2,
    h: 11.6,
    chips: [
      {
        model: "TPQ50551Q-DFTR-S",
        series: "升压变换器",
        note: "用于 HV-LV DC/DC 升压与能量变换链路。",
        url: "https://www.3peak.cn/boost-converter/tpq50551q"
      }
    ]
  },
  {
    id: "ldo-q1",
    label: "电压跟随器LDO",
    x: 30.9,
    y: 36.7,
    w: 8.9,
    h: 5.5,
    chips: [
      {
        model: "NSE4254F-Q1",
        series: "LDO",
        note: "用于驱动与控制链路稳压。",
        url: "https://www.novosns.com/Cn/Index/pageView/catid/619/id/2660.html"
      }
    ]
  },
  {
    id: "gate-driver",
    label: "隔离式栅极驱动",
    x: 42.9,
    y: 36.4,
    w: 15.2,
    h: 7.2,
    chips: [
      {
        model: "NSI6911F5A-Q1",
        series: "隔离式栅极驱动",
        note: "驱动功率管并提供隔离能力。",
        url: "https://jlcpcb.com/partdetail/-NSI6911/C9900134550"
      }
    ]
  },
  {
    id: "iso-vsense",
    label: "隔离电压采样放大器",
    x: 50.8,
    y: 71.9,
    w: 11.4,
    h: 5.6,
    chips: [
      {
        model: "NSI1311-Q1",
        series: "隔离电压采样放大器",
        note: "实现高压侧电压采样隔离反馈。",
        url: "https://www.novosns.com/isolated-voltage-amplifier-1062"
      }
    ]
  },
  {
    id: "opamp",
    label: "单CMOS运算放大器",
    x: 54.6,
    y: 83.1,
    w: 13.9,
    h: 5.5,
    chips: [
      {
        model: "NSOPA2401-Q1",
        series: "单CMOS运算放大器",
        note: "用于信号调理与辅助放大电路。",
        url: "https://www.novosns.com/isolated-voltage-amplifier-1062"
      }
    ]
  },
  {
    id: "voltage-follower",
    label: "电压跟随器",
    x: 30.9,
    y: 53.0,
    w: 8.9,
    h: 5.5,
    chips: [
      {
        model: "NSE4254",
        series: "电压跟随器",
        note: "用于下游模拟链路缓冲与跟随。",
        url: "https://www.novosns.com/isolated-voltage-amplifier-1062"
      }
    ]
  },
  {
    id: "power-module",
    label: "功率模块",
    x: 61.6,
    y: 37.0,
    w: 15.8,
    h: 34.0,
    chips: [
      {
        model: "GD1000HTA75P6HLT",
        series: "功率模块",
        note: "用于电机驱动功率级的 IGBT 功率模块。",
        url: "https://www.datasheet.live/pdfviewer?url=https%3A%2F%2Fwww.datasheet.live%2Fdatasheet%2Figbtsemi%2FGD1000HTA75P6HLT.pdf"
      }
    ]
  },
  {
    id: "current-sensor",
    label: "电流传感器",
    x: 78.8,
    y: 48.8,
    w: 8.2,
    h: 14.9,
    chips: [
      {
        model: "SC4643",
        series: "电流传感器",
        note: "电机相电流检测可选方案 A。",
        url: "https://www.semiment.com/productdetail_6408.html"
      },
      {
        model: "NSM2032",
        series: "电流传感器",
        note: "电机相电流检测可选方案 B。",
        url: "https://www.novosns.com/linear-hall-current-sensor-3293"
      }
    ]
  }
];
// demo.svg 无语义标注（g.chip 等），按 SVG 坐标选择器定位热点
const auxInverterHotspotSelectors = [
  {
    id: "pmic",
    label: "电源管理芯片",
    selectors: ['rect[x="69.5"][y="107.5"]']
  },
  {
    id: "mcu",
    label: "MCU",
    selectors: ['rect[x="69"][y="216"]']
  },
  {
    id: "boost",
    label: "升压变换器",
    selectors: ['rect[x="467.5"][y="12.5"]']
  },
  {
    id: "voltage-follower",
    label: "电压跟随器",
    selectors: ['path[d^="M256 237.5C"]', 'path[d^="M256 346.5C"]']
  },
  {
    id: "gate-driver",
    label: "隔离式栅极驱动",
    selectors: ['rect[x="310.5"][y="232.5"]', 'rect[x="310.5"][y="338.5"]']
  },
  {
    id: "opamp",
    label: "单CMOS运算放大器",
    selectors: ['rect[x="310.5"][y="419.5"]']
  },
  {
    id: "iso-vsense",
    label: "隔离电压采样放大器",
    selectors: ['rect[x="454.5"][y="479.5"]']
  },
  {
    id: "power-module",
    label: "功率模块",
    selectors: ['rect[x="469.5"][y="209.5"]']
  },
  {
    id: "current-sensor",
    label: "电流传感器",
    selectors: ['circle[cx="730.5"][cy="311.5"]']
  }
];

watch(
  activeDomain,
  (domain) => {
    if (!domain) {
      selectedSubsystem.value = "";
      selectedSubsystemDetail.value = "";
      return;
    }
    const firstSubsystem = domain.subsystems[0] ?? "";
    selectedSubsystem.value = firstSubsystem;
    selectedSubsystemDetail.value = getDefaultSubsystemDetail(domain, firstSubsystem);
  },
  { immediate: true }
);

/* ===== 信息娱乐系统（IVI）各框图：可点击芯片节点（型号取自 SVG 标注，按型号查芯片库） ===== */
const iviChipNodes = [
  { id: "can1", label: "CAN 收发器（通道 1）", model: "SIT1042" },
  { id: "can2", label: "CAN 收发器（通道 2）", model: "SIT1042" },
  { id: "can-transceiver", label: "CAN 收发器", model: "SIT1042" },
  { id: "lin1", label: "LIN 收发器", model: "SIT1021" },
  // 蓝牙钥匙主模块框图（ai_demo.svg）
  { id: "ai-buck", label: "宽压同步 Buck", model: "SGM61330CQTUK12G/TR" },
  { id: "ai-ldo", label: "固定 5V LDO", model: "NSR31050-QSTAR" },
  { id: "ai-can", label: "车规级 CAN 收发器", model: "SIT1042AQT/3" },
  { id: "ai-mcu", label: "蓝牙钥匙主控 MCU", model: "LS-E1460AIPQJLBT" },
  { id: "ai-ble", label: "BLE/SLE 无线通信 SoC", model: "BS21Q333A" },
  { id: "ai-flash", label: "NOR Flash", model: "GT25064EB-HWLA2-TR" },
  { id: "ai-eeprom", label: "EEPROM", model: "GT25C64A-2GLA1-TR" },
  { id: "ai-secure", label: "车规级安全芯片", model: "JW17051Q20I" }
];
/* ===== 统一的框图芯片节点选择：不同框图的节点清单由 svgKey 决定 ===== */
// 当前框图对应的芯片节点清单
const activeDiagramChipNodes = computed(() => {
  if (!shouldShowSubsystemDiagram.value) {
    return [];
  }
  return activeSlide.value?.svgKey === "aux-inverter" ? auxInverterChipNodes : iviChipNodes;
});
// 统一的选中节点状态：切换框图时重置
const selectedNodeId = ref("");
const activeChipNode = computed(
  () =>
    activeDiagramChipNodes.value.find((node) => node.id === selectedNodeId.value) ??
    activeDiagramChipNodes.value[0]
);
const activeNodeChips = computed(() => {
  const node = activeChipNode.value;
  if (!node) {
    return [];
  }
  // 辅助逆变器节点自带完整芯片数据；IVI 节点按型号前缀查芯片库
  return node.chips?.length ? node.chips : getIviChipsByModel(node.model);
});
const diagramStageContainer = ref(null);
// 当前框图中已绑定交互的芯片节点数量：为 0 时说明该框图没有可点击芯片，无需展示芯片面板
const activeHotspotCount = ref(0);

function getIviChipsByModel(model) {
  const prefix = String(model || "").toUpperCase();
  return chipRecords
    .filter((record) => String(record.model || "").toUpperCase().startsWith(prefix))
    .map((record) => ({
      model: record.model,
      series: record.secondaryCategory,
      note: record.remark || `${record.manufacturer} · ${record.secondaryCategory}`,
      url: record.datasheetUrl
    }));
}

const activeDiagramPanel = computed(() => {
  // 当前框图没有任何可交互芯片节点时（如纯示意图），隐藏芯片面板
  if (!shouldShowSubsystemDiagram.value || !activeHotspotCount.value) {
    return null;
  }
  const node = activeChipNode.value;
  if (!node) {
    return null;
  }
  return {
    title: node.model
      ? `${node.label} ${node.model} 系列可选芯片`
      : `${node.label} 可选芯片`,
    chips: activeNodeChips.value
  };
});

/* ===== 芯片面板高度：跟随框图 SVG 实际渲染尺寸，超出部分由面板内部滚轮滚动 ===== */
const diagramPanelMaxHeight = ref(0);
const chipListRef = ref(null);

function updateDiagramPanelHeight() {
  const svg = diagramStageContainer.value?.querySelector("svg");
  diagramPanelMaxHeight.value = svg ? Math.round(svg.getBoundingClientRect().height) : 0;
}

/**
 * 把落在面板（标题、留白等非列表区域）上的滚轮事件转发给芯片列表，
 * 避免浏览器把滚轮冒泡到页面导致整页滚动。
 * 列表内部区域仍交给浏览器原生滚动，保留平滑滚动手感。
 */
function handlePanelWheel(event) {
  const list = chipListRef.value;
  if (!list || event.deltaY === 0) {
    return;
  }
  // 事件本来就发生在列表内：交给原生滚动处理
  if (list.contains(event.target)) {
    return;
  }
  // 列表内容不足以产生滚动时，不拦截，让页面正常滚动
  if (list.scrollHeight <= list.clientHeight) {
    return;
  }
  const atTop = list.scrollTop <= 0;
  const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 1;
  // 已到列表边界仍继续滚动：放行给页面，避免"卡住"
  if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
    return;
  }
  event.preventDefault();
  list.scrollTop += event.deltaY;
}


// 切换子系统时回到第一套方案，避免沿用上一个子系统的浏览位置
watch(selectedSubsystem, () => {
  activeSlideIndex.value = 0;
});

// 详情切换后可展示的框图数量可能变少，索引越界时回到第一张
watch(activeSubsystemSlides, (slides) => {
  if (activeSlideIndex.value >= slides.length) {
    activeSlideIndex.value = 0;
  }
});

watch([shouldShowSubsystemDiagram, activeSlide], ([shouldShow, slide]) => {
  if (!shouldShow || !slide) {
    activeHotspotCount.value = 0;
    return;
  }
  selectedNodeId.value = activeDiagramChipNodes.value[0]?.id ?? "";
  nextTick(() => {
    setupActiveDiagramInteraction();
    updateDiagramPanelHeight();
  });
});

function setupIviSvgInteraction() {
  const svgRoot = diagramStageContainer.value?.querySelector("svg");
  if (!svgRoot) {
    return [];
  }
  svgRoot.classList.add("diagram-svg");
  const hotspotIds = [];
  // 形态一：g.chip（IVI 主机框图），模型号写在组内文本里，点击区域为 .clickbox
  for (const group of svgRoot.querySelectorAll("g.chip")) {
    const modelMatch = group.textContent.match(/SIT[0-9A-Za-z/-]*/);
    if (!modelMatch) {
      continue;
    }
    const model = modelMatch[0].toUpperCase();
    const node =
      iviChipNodes.find((item) => item.id === group.id && item.model === model) ??
      iviChipNodes.find((item) => item.model === model);
    const clickbox = group.querySelector(".clickbox");
    if (!node || !clickbox) {
      continue;
    }
    clickbox.classList.add("ivi-chip-hotspot");
    clickbox.dataset.nodeId = node.id;
    clickbox.setAttribute("role", "button");
    clickbox.setAttribute("tabindex", "0");
    clickbox.setAttribute("aria-label", `查看 ${node.label} ${node.model} 可选芯片`);
    hotspotIds.push(node.id);
  }
  // 形态二：g.chip-node（蓝牙框图），模型号在 data-part-number 上，组本身就是点击区域
  for (const group of svgRoot.querySelectorAll("g.chip-node")) {
    const model = String(group.dataset.partNumber || "").toUpperCase();
    const node = iviChipNodes.find((item) => item.model === model);
    if (!node) {
      continue;
    }
    group.classList.add("ivi-chip-hotspot");
    group.dataset.nodeId = node.id;
    group.setAttribute("role", "button");
    group.setAttribute("tabindex", "0");
    group.setAttribute("aria-label", `查看 ${node.label} ${node.model} 可选芯片`);
    hotspotIds.push(node.id);
  }
  // 形态三：g.clickable（蓝牙钥匙主模块框图），型号写在 data-part-number 上，组本身即点击区域
  for (const group of svgRoot.querySelectorAll("g.clickable[data-part-number]:not(.chip-node)")) {
    const model = String(group.dataset.partNumber || "").toUpperCase();
    const node = iviChipNodes.find((item) => item.model.toUpperCase() === model);
    if (!node) {
      continue;
    }
    // SVG 内联 onclick/onkeydown 依赖未随 v-html 执行的 <script>，先移除以免点击报错
    group.removeAttribute("onclick");
    group.removeAttribute("onkeydown");
    group.classList.add("ivi-chip-hotspot");
    group.dataset.nodeId = node.id;
    group.setAttribute("role", "button");
    group.setAttribute("tabindex", "0");
    group.setAttribute("aria-label", `查看 ${node.label} ${node.model} 可选芯片`);
    hotspotIds.push(node.id);
  }
  return hotspotIds;
}

// 把当前选中节点同步到框图高亮（仅 IVI 系框图有 selected 样式规则；其他框图为空操作）
function syncDiagramSelection() {
  const svgRoot = diagramStageContainer.value?.querySelector("svg");
  if (!svgRoot) {
    return;
  }
  for (const group of svgRoot.querySelectorAll("g.chip")) {
    const clickbox = group.querySelector(".clickbox");
    group.classList.toggle("selected", clickbox?.dataset.nodeId === selectedNodeId.value);
  }
  for (const group of svgRoot.querySelectorAll("g.chip-node")) {
    group.classList.toggle("selected", group.dataset.nodeId === selectedNodeId.value);
  }
  for (const group of svgRoot.querySelectorAll("g.clickable[data-part-number]:not(.chip-node)")) {
    group.classList.toggle("selected", group.dataset.nodeId === selectedNodeId.value);
  }
}

// 统一的框图点击/键盘交互：两类热点（.diagram-hotspot / .ivi-chip-hotspot）共用
function handleDiagramClick(event) {
  const target = event.target.closest(".diagram-hotspot, .ivi-chip-hotspot");
  if (!target) {
    return;
  }
  selectedNodeId.value = target.dataset.nodeId;
  syncDiagramSelection();
}

function handleDiagramKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  const target = event.target.closest(".diagram-hotspot, .ivi-chip-hotspot");
  if (!target) {
    return;
  }
  event.preventDefault();
  selectedNodeId.value = target.dataset.nodeId;
  syncDiagramSelection();
}

function chooseSubsystem(subsystem) {
  selectedSubsystem.value = subsystem;
  selectedSubsystemDetail.value = getDefaultSubsystemDetail(activeDomain.value, subsystem);
}

function chooseSubsystemDetail(detail) {
  selectedSubsystemDetail.value = detail;
}

function getDefaultSubsystemDetail(domain, subsystem) {
  if (!domain || !subsystem) {
    return "";
  }
  const options = domain.subsystemDetails?.[subsystem] ?? [];
  return options[0] ?? "";
}

function buildSubsystemCover(subsystemTitle, domainTitle, index) {
  const [colorA, colorB, colorC] = colorPalettes[index % colorPalettes.length];
  const safeDomain = escapeXml(domainTitle || "System Domain");
  const safeSubsystem = escapeXml(subsystemTitle || "Subsystem");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 360'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${colorA}'/>
      <stop offset='60%' stop-color='${colorB}'/>
      <stop offset='100%' stop-color='${colorC}'/>
    </linearGradient>
  </defs>
  <rect width='1200' height='360' fill='url(#g)'/>
  <rect x='32' y='34' width='1136' height='292' rx='18' fill='rgba(255,255,255,0.12)'/>
  <text x='72' y='130' fill='white' font-size='28' font-family='Segoe UI, PingFang SC, Microsoft YaHei'>${safeDomain}</text>
  <text x='72' y='198' fill='white' font-size='44' font-weight='700' font-family='Segoe UI, PingFang SC, Microsoft YaHei'>${safeSubsystem}</text>
  <text x='72' y='252' fill='rgba(255,255,255,0.86)' font-size='24' font-family='Segoe UI, PingFang SC, Microsoft YaHei'>点击左侧子系统切换图片视图</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// 辅助逆变器框图（demo.svg）：按坐标选择器绑定热点
function setupAuxInverterHotspots() {
  const svgRoot = diagramStageContainer.value?.querySelector("svg");
  if (!svgRoot) {
    return [];
  }
  svgRoot.classList.add("diagram-svg");
  const hotspotIds = [];
  for (const config of auxInverterHotspotSelectors) {
    for (const selector of config.selectors) {
      for (const node of svgRoot.querySelectorAll(selector)) {
        node.classList.add("diagram-hotspot");
        node.dataset.nodeId = config.id;
        node.setAttribute("role", "button");
        node.setAttribute("tabindex", "0");
        node.setAttribute("aria-label", `查看 ${config.label} 可选芯片`);
      }
    }
    hotspotIds.push(config.id);
  }
  return hotspotIds;
}

// 统一的框图交互入口：按当前框图的 svgKey 选择热点绑定方式
function setupActiveDiagramInteraction() {
  const hotspotIds =
    activeSlide.value?.svgKey === "aux-inverter"
      ? setupAuxInverterHotspots()
      : setupIviSvgInteraction();
  activeHotspotCount.value = hotspotIds.length;
  // 当前框图不含默认节点时，自动选中框图内第一个可点击芯片，保证高亮与右侧面板一致
  if (hotspotIds.length && !hotspotIds.includes(selectedNodeId.value)) {
    selectedNodeId.value = hotspotIds[0];
  }
  syncDiagramSelection();
}

onMounted(() => {
  if (shouldShowSubsystemDiagram.value) {
    nextTick(() => {
      setupActiveDiagramInteraction();
    });
  }
  nextTick(() => {
    updateDiagramPanelHeight();
  });
  window.addEventListener("resize", updateDiagramPanelHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDiagramPanelHeight);
  const svgRoot = diagramStageContainer.value?.querySelector("svg");
  if (!svgRoot) {
    return;
  }
  svgRoot.querySelectorAll(".diagram-hotspot, .ivi-chip-hotspot").forEach((hotspot) => {
    hotspot.classList.remove("diagram-hotspot", "ivi-chip-hotspot");
    hotspot.removeAttribute("data-node-id");
    hotspot.removeAttribute("role");
    hotspot.removeAttribute("tabindex");
    hotspot.removeAttribute("aria-label");
  });
});

function getSourceDomain(url) {
  if (!url) {
    return "";
  }
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (_error) {
    return "";
  }
}
</script>

<template>
  <main class="container main-content page-sections">
    <section v-if="validDomain" class="panel detail-page">
      <div class="section-head with-action">
        <div>
          <div class="breadcrumb">首页 / Domain / {{ activeDomain?.title }}</div>
          <h1>{{ activeDomain?.title }}</h1>
          <p>{{ activeDomain?.summary }}</p>
        </div>
        <RouterLink to="/" class="btn ghost">返回 Domain 首页</RouterLink>
      </div>

      <div v-if="!shouldShowSubsystemDiagram" class="domain-cover">
        <img :src="selectedSubsystemCover" :alt="selectedSubsystem" class="cover-image" />
        <div class="cover-caption">{{ selectedSubsystemDisplay }}</div>
      </div>
      <section v-else class="diagram-panel">
        <div class="diagram-stage">
          <div
            ref="diagramStageContainer"
            class="diagram-canvas diagram-svg-container"
            :aria-label="activeSlide ? activeSlide.label : '系统框图'"
            v-html="activeSlideSvg"
            @click="handleDiagramClick"
            @keydown="handleDiagramKeydown"
          >
          </div>
          <template v-if="activeSubsystemSlides.length > 1">
            <button
              type="button"
              class="slide-arrow prev"
              aria-label="查看上一套方案"
              @click="prevSubsystemSlide"
            >‹</button>
            <button
              type="button"
              class="slide-arrow next"
              aria-label="查看下一套方案"
              @click="nextSubsystemSlide"
            >›</button>
          </template>
          <div v-if="activeSlide" class="diagram-slide-caption">
            {{ activeSubsystemSlides.length > 1 ? `${activeSlideIndex + 1} / ${activeSubsystemSlides.length} · ` : "" }}{{ activeSlide.label }}
          </div>
        </div>
        <aside
          v-if="activeDiagramPanel"
          class="chip-side-panel"
          :style="diagramPanelMaxHeight ? { height: `${diagramPanelMaxHeight}px` } : undefined"
          @wheel="handlePanelWheel"
        >
          <h2>{{ activeDiagramPanel.title }}</h2>
          <div
            v-if="activeDiagramPanel.chips.length"
            ref="chipListRef"
            class="chip-list"
            tabindex="0"
            aria-label="可选芯片列表，可使用鼠标滚轮上下浏览"
          >
            <a
              v-for="chip in activeDiagramPanel.chips"
              :key="chip.model"
              class="chip-option-card"
              :class="{ clickable: Boolean(chip.url) }"
              :href="chip.url || '#'"
              :target="chip.url ? '_blank' : undefined"
              :rel="chip.url ? 'noreferrer noopener' : undefined"
              @click="!chip.url && $event.preventDefault()"
            >
              <div class="chip-series">{{ chip.series }}</div>
              <div class="chip-model">{{ chip.model }}</div>
              <div v-if="chip.url" class="chip-link-meta" aria-label="芯片来源链接">
                <span class="external-icon" aria-hidden="true">↗</span>
                <span>{{ getSourceDomain(chip.url) }}</span>
              </div>
              <p>{{ chip.note }}</p>
            </a>
          </div>
          <p v-else class="chip-panel-empty">
            数据库中暂无该型号的芯片资料。
          </p>
        </aside>
      </section>

      <div class="subsystem-layout">
        <aside class="subsystem-list">
          <h2>第二层：子系统（Subsystem Level）</h2>
          <button
            v-for="subsystem in activeDomain?.subsystems"
            :key="subsystem"
            class="subsystem-item"
            :class="{ active: subsystem === selectedSubsystem }"
            @click="chooseSubsystem(subsystem)"
          >
            {{ subsystem }}
          </button>
        </aside>

        <article class="subsystem-detail">
          <h2>子系统详情</h2>
          <p>{{ selectedSubsystem }}</p>
          <div v-if="selectedSubsystemOptions.length" class="detail-selector">
            <h3>可选详情</h3>
            <div class="detail-options">
              <button
                v-for="detail in selectedSubsystemOptions"
                :key="detail"
                class="subsystem-item detail-option"
                :class="{ active: detail === selectedSubsystemDetail }"
                @click="chooseSubsystemDetail(detail)"
              >
                {{ detail }}
              </button>
            </div>
          </div>
          <p v-if="selectedSubsystemDetail" class="detail-current">当前详情：{{ selectedSubsystemDetail }}</p>
          <p v-else class="detail-empty">该子系统暂无对应的详情选项。</p>
          <div v-if="selectedSolutionProvider" class="provider-block">
            <h3>设计方案提供单位：</h3>
            <a
              v-if="selectedSolutionProvider.url"
              class="provider-card clickable"
              :href="selectedSolutionProvider.url"
              target="_blank"
              rel="noreferrer noopener"
            >
              <span class="provider-main">
                <span class="provider-label">承办企业</span>
                <span class="provider-name">{{ selectedSolutionProvider.name }}</span>
              </span>
              <span class="provider-url-hint" aria-label="企业官网链接">
                <span>{{ getSourceDomain(selectedSolutionProvider.url) }}</span>
                <span class="external-icon" aria-hidden="true">↗</span>
              </span>
            </a>
            <div v-else class="provider-card">
              <span class="provider-main">
                <span class="provider-label">承办企业</span>
                <span class="provider-name">{{ selectedSolutionProvider.name }}</span>
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section v-else class="panel">
      <div class="empty-state">
        <h2>未找到该 Domain</h2>
        <p>请返回首页重新选择系统级分类。</p>
        <RouterLink to="/" class="btn primary">返回首页</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-head.with-action {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.section-head h1 {
  margin: 6px 0 8px;
  font-size: 30px;
}

.section-head p {
  margin: 0;
  color: #475569;
}

.breadcrumb {
  color: #94a3b8;
  font-size: 12px;
}

.domain-cover {
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  overflow: hidden;
  min-height: 240px;
  background: #f8fbff;
  position: relative;
}

.cover-image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 240px;
  object-fit: cover;
}

.cover-caption {
  position: absolute;
  left: 14px;
  bottom: 14px;
  border: 1px solid rgba(191, 219, 254, 0.45);
  background: rgba(15, 23, 42, 0.42);
  color: #ffffff;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

.subsystem-layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 14px;
}

.diagram-panel {
  display: grid;
  grid-template-columns: 1.75fr 1fr;
  gap: 14px;
}

.diagram-canvas {
  position: relative;
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  background: #ecfdf3;
  overflow: hidden;
}

/* ===== 多厂商方案轮播 ===== */
.diagram-stage {
  position: relative;
}

.slide-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(255, 255, 255, 0.9);
  color: #1e3a8a;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.14);
  transition: 0.2s ease;
}

.slide-arrow.prev {
  left: 10px;
}

.slide-arrow.next {
  right: 10px;
}

.slide-arrow:hover {
  background: #eff6ff;
  border-color: #60a5fa;
  transform: translateY(-50%) scale(1.06);
}

.slide-arrow:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.diagram-slide-caption {
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 2;
  border: 1px solid rgba(191, 219, 254, 0.5);
  background: rgba(15, 23, 42, 0.55);
  color: #ffffff;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

.diagram-svg-container :deep(.diagram-svg) {
  display: block;
  width: 100%;
  height: auto;
}

.diagram-svg-container :deep(.diagram-hotspot) {
  cursor: pointer;
  fill: #eff6ff;
  stroke: #0284c7;
  stroke-width: 1.6;
  transition: fill 0.2s ease, stroke 0.2s ease, opacity 0.2s ease;
}

.diagram-svg-container :deep(.diagram-hotspot:hover) {
  fill: #dbeafe;
  stroke: #0369a1;
}

.diagram-svg-container :deep(.diagram-hotspot:focus-visible) {
  fill: #bfdbfe;
  stroke: #0c4a6e;
  stroke-width: 2;
  outline: none;
}

.diagram-svg-container :deep(g.chip .clickbox) {
  outline: none;
}

.diagram-svg-container :deep(g.chip:hover .block-green),
.diagram-svg-container :deep(g.chip:focus-within .block-green) {
  stroke: #2f80ed;
  stroke-width: 3;
}

.diagram-svg-container :deep(g.chip.selected .block-green) {
  stroke: #2f80ed;
  stroke-width: 3.5;
}

.chip-panel-empty {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.chip-side-panel {
  border: 1px solid #dbeafe;
  border-radius: 14px;
  padding: 14px;
  background: #f8fbff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}

.chip-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 6px;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #93c5fd transparent;
}

.chip-list:focus-visible {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
  border-radius: 10px;
}

.chip-list::-webkit-scrollbar {
  width: 8px;
}

.chip-list::-webkit-scrollbar-track {
  background: transparent;
}

.chip-list::-webkit-scrollbar-thumb {
  background: #bfdbfe;
  border-radius: 999px;
}

.chip-list::-webkit-scrollbar-thumb:hover {
  background: #93c5fd;
}

.chip-side-panel h2 {
  margin: 0;
  font-size: 18px;
}

.chip-option-card {
  display: block;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #ffffff;
  padding: 10px 12px;
  text-decoration: none;
  color: inherit;
}

.chip-option-card.clickable {
  cursor: pointer;
  transition: 0.2s ease;
}

.chip-option-card.clickable:hover {
  border-color: #60a5fa;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.14);
}

.chip-series {
  font-size: 12px;
  color: #64748b;
}

.chip-model {
  margin-top: 2px;
  font-size: 16px;
  font-weight: 700;
  color: #1e3a8a;
}

.chip-link-meta {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #0369a1;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 999px;
  padding: 2px 8px;
}

.external-icon {
  font-size: 12px;
  line-height: 1;
}

.chip-option-card p {
  margin: 6px 0 0;
  font-size: 13px;
  color: #475569;
}

.subsystem-list {
  border: 1px solid #dbeafe;
  border-radius: 14px;
  padding: 14px;
  background: #f8fbff;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subsystem-list h2 {
  margin: 0 0 4px;
  font-size: 18px;
}

.subsystem-item {
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 10px 12px;
  text-align: left;
  background: #ffffff;
  color: #1f2937;
  cursor: pointer;
}

.subsystem-item.active {
  border-color: #60a5fa;
  color: #1d4ed8;
  background: #eff6ff;
}

.subsystem-detail {
  border: 1px solid #dbeafe;
  border-radius: 14px;
  padding: 14px;
  background: #ffffff;
}

.subsystem-detail h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.subsystem-detail p {
  margin: 0;
  color: #334155;
}

.detail-selector {
  margin-top: 10px;
}

.detail-selector h3 {
  margin: 0 0 8px;
  font-size: 15px;
}

.detail-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-option {
  width: auto;
}

.detail-current,
.detail-empty {
  margin-top: 10px;
  font-size: 13px;
  color: #475569;
}

.provider-block {
  margin-top: 12px;
}

.provider-block h3 {
  margin: 0 0 8px;
  font-size: 15px;
}

.provider-card {
  display: block;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid #bfdbfe;
  border-left: 4px solid #2563eb;
  border-radius: 10px;
  background: linear-gradient(90deg, #eff6ff 0%, #f8fbff 100%);
  color: #1e293b;
  text-decoration: none;
  padding: 10px 12px;
  transition: 0.2s ease;
}

.provider-card.clickable:hover {
  background: linear-gradient(90deg, #dbeafe 0%, #eff6ff 100%);
  border-color: #60a5fa;
}

.provider-main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.provider-label {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.provider-name {
  font-weight: 700;
  color: #0f172a;
}

.provider-url-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0369a1;
  border: 1px solid #bae6fd;
  border-radius: 999px;
  background: #f0f9ff;
  padding: 2px 10px;
  font-size: 12px;
  flex-shrink: 0;
}

.empty-state {
  padding: 24px;
  border: 1px dashed #94a3b8;
  border-radius: 14px;
  text-align: center;
}

.empty-state h2 {
  margin: 0;
}

.empty-state p {
  margin: 8px 0 14px;
  color: #64748b;
}

@media (max-width: 960px) {
  .diagram-panel,
  .subsystem-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .section-head.with-action {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-head h1 {
    font-size: 26px;
  }
}
</style>
