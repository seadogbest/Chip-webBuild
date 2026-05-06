<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { domains } from "../data/domains";
import diagram48vSvg from "../assets/Slide 16_9 - 1.svg?raw";

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
const shouldShowBodyPower48vDiagram = computed(
  () =>
    activeDomain.value?.key === "domain-body-power" &&
    selectedSubsystem.value === "汽车辅助系统" &&
    selectedSubsystemDetail.value === "汽车48V辅助电机驱动"
);
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
const selectedSolutionProvider = computed(() => {
  if (!activeDomain.value) {
    return null;
  }
  const providerKey = selectedSubsystemDetail.value || selectedSubsystem.value;
  const provider = activeDomain.value.solutionProviders?.[providerKey];
  return provider ?? null;
});
const diagramNodes = [
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
const selectedChipNodeId = ref(diagramNodes[0].id);
const selectedChipNode = computed(() => diagramNodes.find((node) => node.id === selectedChipNodeId.value) ?? diagramNodes[0]);
const selectedNodeChips = computed(() => selectedChipNode.value?.chips ?? []);
const diagramSvgContainer = ref(null);
const diagramHotspotSelectorMap = [
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

watch(shouldShowBodyPower48vDiagram, (shouldShow) => {
  if (shouldShow) {
    selectedChipNodeId.value = diagramNodes[0].id;
    nextTick(() => {
      setupSvgHotspots();
    });
  }
});

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

function chooseChipNode(nodeId) {
  selectedChipNodeId.value = nodeId;
}

function setupSvgHotspots() {
  const container = diagramSvgContainer.value;
  if (!container) {
    return;
  }
  const svgRoot = container.querySelector("svg");
  if (!svgRoot) {
    return;
  }
  svgRoot.classList.add("diagram-svg");
  const hotspotSet = new Set();
  for (const config of diagramHotspotSelectorMap) {
    for (const selector of config.selectors) {
      const nodes = svgRoot.querySelectorAll(selector);
      for (const node of nodes) {
        hotspotSet.add(node);
        node.classList.add("diagram-hotspot");
        node.dataset.nodeId = config.id;
        node.setAttribute("role", "button");
        node.setAttribute("tabindex", "0");
        node.setAttribute("aria-label", `查看 ${config.label} 可选芯片`);
      }
    }
  }
  for (const node of svgRoot.querySelectorAll(".diagram-hotspot")) {
    if (!hotspotSet.has(node)) {
      node.classList.remove("diagram-hotspot");
      node.removeAttribute("data-node-id");
      node.removeAttribute("role");
      node.removeAttribute("tabindex");
      node.removeAttribute("aria-label");
    }
  }
}

function handleSvgClick(event) {
  const target = event.target.closest(".diagram-hotspot");
  if (!target) {
    return;
  }
  chooseChipNode(target.dataset.nodeId);
}

function handleSvgKeyboard(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  const target = event.target.closest(".diagram-hotspot");
  if (!target) {
    return;
  }
  event.preventDefault();
  chooseChipNode(target.dataset.nodeId);
}

onMounted(() => {
  if (!shouldShowBodyPower48vDiagram.value) {
    return;
  }
  setupSvgHotspots();
});

onBeforeUnmount(() => {
  const container = diagramSvgContainer.value;
  if (!container) {
    return;
  }
  container.querySelectorAll(".diagram-hotspot").forEach((hotspot) => {
    hotspot.classList.remove("diagram-hotspot");
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

      <div v-if="!shouldShowBodyPower48vDiagram" class="domain-cover">
        <img :src="selectedSubsystemCover" :alt="selectedSubsystem" class="cover-image" />
        <div class="cover-caption">{{ selectedSubsystemDisplay }}</div>
      </div>
      <section v-else class="diagram-panel">
        <div
          ref="diagramSvgContainer"
          class="diagram-canvas diagram-svg-container"
          aria-label="48V 轻混系统框图"
          v-html="diagram48vSvg"
          @click="handleSvgClick"
          @keydown="handleSvgKeyboard"
        >
        </div>
        <aside class="chip-side-panel">
          <h2>{{ selectedChipNode.label }} 可选芯片</h2>
          <a
            v-for="chip in selectedNodeChips"
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
          <div class="provider-block">
            <h3>设计方案提供单位：</h3>
            <a
              v-if="selectedSolutionProvider?.name && selectedSolutionProvider?.url"
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
            <div v-else-if="selectedSolutionProvider?.name" class="provider-card">
              <span class="provider-main">
                <span class="provider-label">承办企业</span>
                <span class="provider-name">{{ selectedSolutionProvider.name }}</span>
              </span>
            </div>
            <div v-else class="provider-card empty"></div>
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

.chip-side-panel {
  border: 1px solid #dbeafe;
  border-radius: 14px;
  padding: 14px;
  background: #f8fbff;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.provider-card.empty {
  min-height: 42px;
  background: #f8fafc;
  border-style: dashed;
  border-color: #cbd5e1;
  border-left-color: #cbd5e1;
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
