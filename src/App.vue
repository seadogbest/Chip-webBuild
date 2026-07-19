<script setup>
import { computed } from "vue";
import { RouterView } from "vue-router";
import { siteMeta } from "./data/domains";
import titleImage from "./assets/title.png";

// ========== 高德静态地图配置 ==========
// 1. 申请 Key：https://console.amap.com/ → 创建应用 → Web服务
// 2. 拾取坐标：https://lbs.amap.com/tools/picker → 搜索「珠山湖大道663号」
const MAP_CONFIG = {
  key: "91e59b168c49871f2b32272d67ce98d3",          // 替换为你的高德 Web 服务 Key
  lng: "114.081458",               // 替换为拾取器获取的精确经度
  lat: "30.4459",                // 替换为拾取器获取的精确纬度
  zoom: 14,
  width: 560,
  height: 280,
};

const amapPlaceUrl = "https://ditu.amap.com/place/B001B17D6E";

const staticMapUrl = computed(() => {
  const { key, lng, lat, zoom, width, height } = MAP_CONFIG;
  if (key === "YOUR_AMAP_KEY") return "";
  const location = `${lng},${lat}`;
  return `https://restapi.amap.com/v3/staticmap?location=${location}&zoom=${zoom}&size=${width}*${height}&markers=mid,,A:${location}&key=${key}`;
});
</script>

<template>
  <div class="page">
    <header class="site-header">
      <div class="container header-inner">
        <div class="brand">
          <span class="brand-mark"></span>
          <div>
            <div class="brand-text">{{ siteMeta.title }}</div>
            <div class="brand-sub">{{ siteMeta.subtitle }} · {{ siteMeta.slogan }}</div>
          </div>
        </div>
        <span class="badge">{{ siteMeta.reference }}</span>
      </div>
    </header>

    <RouterView />

    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-logo">
          <img :src="titleImage" alt="中国汽车工程学会会标" class="footer-logo-image" />
        </div>
        <div class="footer-content">
          <div class="footer-contact">
            <div class="footer-title">联系我们</div>
            <div class="footer-contact-group">
              <div class="footer-contact-name">分会主任委员 冯超</div>
              <div class="footer-text">联系方式：+86-13886158901</div>
              <a class="footer-link" href="mailto:fengchao@dfmc.com.cn">邮箱：fengchao@dfmc.com.cn</a>
            </div>
            <div class="footer-contact-divider"></div>
            <div class="footer-contact-group">
              <div class="footer-contact-name">分会秘书处 王佳炜</div>
              <div class="footer-text">联系方式：+86-15271926193</div>
              <a class="footer-link" href="mailto:wangjiaw@dfmc.com.cn">邮箱：wangjiaw@dfmc.com.cn</a>
            </div>
            <div class="footer-contact-divider"></div>
            <div class="footer-contact-group">
              <div class="footer-contact-name">分会秘书处 吕海宸</div>
              <div class="footer-text">联系方式：+86-13972489607</div>
              <a class="footer-link" href="mailto:lvhaichen@dfmc.com.cn">邮箱：lvhaichen@dfmc.com.cn</a>
            </div>
          </div>
          <div class="footer-map-card">
            <div class="footer-map-label">Location</div>
            <div class="footer-map-title">东风研发总院</div>
            <p class="footer-map-address">湖北省武汉市武汉经济技术开发区珠山湖大道663号</p>
            <img
              v-if="staticMapUrl"
              :src="staticMapUrl"
              alt="东风研发总院位置地图"
              class="footer-map-image"
            />
            <a
              class="footer-map-btn"
              href="https://ditu.amap.com/place/B001B17D6E"
              target="_blank"
              rel="noreferrer noopener"
            >
              <span>查看地图</span>
              <span class="footer-map-arrow">↗</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
