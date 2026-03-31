<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { domains, homepageImage, siteMeta } from "../data/domains";

const subsystemTotal = computed(() => domains.reduce((total, domain) => total + domain.subsystems.length, 0));
const functionTotal = computed(() => domains.reduce((total, domain) => total + domain.functions.length, 0));
</script>

<template>
  <main class="container main-content page-sections">
    <section class="panel hero">
      <div class="hero-content">
        <div class="hero-text">
          <span class="badge soft">System Domain Driven</span>
          <h1>{{ siteMeta.title }}</h1>
          <p>
            以整车系统为主线，将半导体能力映射到具体应用场景，缩短“需求 → 方案 → 器件”的选型路径。
          </p>
          <div class="hero-actions">
            <RouterLink class="btn primary" :to="`/domain/${domains[0].key}`">进入示例 Domain</RouterLink>
            <a class="btn ghost" href="https://www.infineon.cn/applications/automotive" target="_blank" rel="noreferrer">
              参考页面样式
            </a>
          </div>
        </div>
        <div class="hero-image-wrap">
          <img :src="homepageImage.src" :alt="homepageImage.alt" class="hero-image" />
        </div>
      </div>
      <div class="hero-metrics">
        <article class="metric-card">
          <div class="metric-title">System Domain</div>
          <div class="metric-value">{{ domains.length }}</div>
          <div class="metric-sub">第一层系统级分类</div>
        </article>
        <article class="metric-card">
          <div class="metric-title">Subsystem</div>
          <div class="metric-value">{{ subsystemTotal }}</div>
          <div class="metric-sub">第二层子系统条目</div>
        </article>
        <article class="metric-card">
          <div class="metric-title">Function</div>
          <div class="metric-value">{{ functionTotal }}</div>
          <div class="metric-sub">第三层功能模块映射</div>
        </article>
      </div>
    </section>

    <section class="panel section-block">
      <div class="section-head">
        <h2>第一层：系统级分类（Domain Level）</h2>
        <p>点击任意 Domain 卡片，将跳转到新页面展示对应第二层 Subsystem 内容。</p>
      </div>
      <div class="domain-grid">
        <article v-for="domain in domains" :key="domain.key" class="domain-card">
          <div class="image-slot">
            <img v-if="domain.cover" :src="domain.cover" :alt="domain.title" class="domain-image" />
            <div v-else class="image-placeholder">
              <strong>图片位预留</strong>
              <span>{{ domain.coverHint }}</span>
            </div>
          </div>
          <h3>{{ domain.title }}</h3>
          <p>{{ domain.summary }}</p>
          <div class="card-foot">
            <span class="badge">{{ domain.subsystems.length }} 个子系统</span>
            <RouterLink class="btn ghost" :to="`/domain/${domain.key}`">查看 Subsystem</RouterLink>
          </div>
        </article>
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

.hero {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 20px;
  align-items: center;
}

.hero-text h1 {
  margin: 12px 0 10px;
  font-size: 34px;
}

.hero-text p {
  margin: 0;
  color: #475569;
}

.hero-actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-image-wrap {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #dbeafe;
}

.hero-image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.metric-card {
  border: 1px solid #dbeafe;
  border-radius: 14px;
  padding: 14px;
  background: #f8fbff;
}

.metric-title {
  font-size: 13px;
  color: #64748b;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #1d4ed8;
}

.metric-sub {
  font-size: 12px;
  color: #64748b;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-head h2 {
  margin: 0;
  font-size: 24px;
}

.section-head p {
  margin: 6px 0 0;
  color: #475569;
}

.domain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.domain-card {
  border: 1px solid #dbeafe;
  border-radius: 14px;
  padding: 14px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-slot {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #bfdbfe;
  background: #f8fbff;
  min-height: 140px;
}

.domain-image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 140px;
  object-fit: cover;
}

.image-placeholder {
  min-height: 140px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  color: #1e40af;
}

.image-placeholder span {
  color: #64748b;
  font-size: 12px;
}

.domain-card h3 {
  margin: 0;
  font-size: 18px;
}

.domain-card p {
  margin: 0;
  color: #475569;
}

.card-foot {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.badge.soft {
  border-color: transparent;
  background: #dbeafe;
  color: #1d4ed8;
}

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
  }

  .hero-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .hero-metrics {
    grid-template-columns: 1fr;
  }

  .hero-text h1 {
    font-size: 28px;
  }
}
</style>
