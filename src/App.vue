<script setup>
import { RouterView } from "vue-router";
import { siteMeta } from "./data/domains";
import titleImage from "./assets/title.png";
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
            <div class="footer-text">分会主任委员 冯超</div>
            <div class="footer-text">联系方式：+86-13886158901</div>
            <a class="footer-link" href="mailto:fengchao@dfmc.com.cn">邮箱：fengchao@dfmc.com.cn</a>
          </div>
          <div class="footer-map-card">
            <div class="footer-map-label">Location Preview</div>
            <div class="footer-map-title">分会位置展示模块</div>
            <p class="footer-map-text">
              当前先作为底部重心模块预留，后续可接入线下地址、静态地图图像或地图导航入口。
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
