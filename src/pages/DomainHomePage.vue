<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { domains, homepageImage, siteMeta } from "../data/domains";
import { getChipCategoryStats } from "../data/chips";

const subsystemTotal = computed(() => domains.reduce((total, domain) => total + domain.subsystems.length, 0));
const functionTotal = computed(() => domains.reduce((total, domain) => total + domain.functions.length, 0));
const chipCategories = computed(() => getChipCategoryStats());
</script>

<template>
  <main class="container main-content page-sections">
    <section class="panel hero hero-surface">
      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-kicker">Automotive Chip Selection Portal</span>
          <span class="badge soft">System Domain Driven</span>
          <h1>{{ siteMeta.title }}</h1>
          <p>
            以整车系统为主线，展示国产芯片在具体功能模块的选型情况。
          </p>
          <div class="hero-highlights">
            <span>系统域驱动选型</span>
            <span>芯片分类入口</span>
            <span>方案信息聚合</span>
          </div>
          <div class="hero-actions">
            <RouterLink class="btn primary" to="/chip-category/computing">查看热门芯片分类</RouterLink>
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
          <div class="metric-sub">第一层：系统级分类</div>
        </article>
        <article class="metric-card">
          <div class="metric-title">Subsystem</div>
          <div class="metric-value">{{ subsystemTotal }}</div>
          <div class="metric-sub">第二层：子系统条目</div>
        </article>
        <article class="metric-card">
          <div class="metric-title">Function</div>
          <div class="metric-value">{{ functionTotal }}</div>
          <div class="metric-sub">第三层：功能模块映射</div>
        </article>
      </div>
    </section>

    <section class="panel section-block domain-section">
      <div class="section-head">
        <span class="section-eyebrow">System Domain Matrix</span>
        <h2>第一层：系统级分类（Domain Level）</h2>
        <p>点击查看子系统</p>
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
            <RouterLink class="btn ghost" :to="`/domain/${domain.key}`">查看子系统</RouterLink>
          </div>
        </article>
      </div>
    </section>

    <section class="panel section-block chip-section">
      <div class="section-head">
        <span class="section-eyebrow">Chip Function Matrix</span>
        <h2>第二部分：芯片功能分类</h2>
        <p>面向芯片数据库入口，按一级功能分类快速定位芯片信息。</p>
      </div>
      <div class="chip-category-grid">
        <RouterLink
          v-for="(category, index) in chipCategories"
          :key="category.key"
          class="chip-category-card"
          :class="{ 'is-complete': category.datasheetCount, 'is-pending': !category.datasheetCount }"
          :to="`/chip-category/${category.key}`"
        >
          <div class="chip-category-card-top">
            <div class="chip-category-index">{{ String(index + 1).padStart(2, "0") }}</div>
            <span class="badge chip-state-badge" :class="category.datasheetCount ? 'soft success' : 'soft pending'">
              {{ category.datasheetCount ? "已有真实资料" : "资料待补充" }}
            </span>
          </div>
          <div class="chip-category-card-main">
            <h3>{{ category.title }}</h3>
            <p>{{ category.summary }}</p>
          </div>
          <div class="chip-category-stats">
            <article class="chip-stat">
              <strong>{{ category.secondaryCategoryCount }}</strong>
              <span>具体类型</span>
            </article>
            <article class="chip-stat">
              <strong>{{ category.chipCount }}</strong>
              <span>芯片条目</span>
            </article>
            <article class="chip-stat">
              <strong>{{ category.manufacturerCount }}</strong>
              <span>覆盖厂商</span>
            </article>
          </div>
          <div class="chip-category-meta">
            <span class="badge">{{ category.secondaryCategoryCount }} 个二级分类</span>
            <span class="badge">{{ category.datasheetCount }} 个可查看资料</span>
            <span class="badge">{{ category.pendingCount }} 个待补充</span>
          </div>
          <div class="chip-category-progress">
            <div class="chip-category-progress-track">
              <span class="chip-category-progress-fill" :style="{ width: `${category.completionRate}%` }"></span>
            </div>
            <span>{{ category.completionRate }}% 资料完善度</span>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.hero-surface {
  background:
    radial-gradient(circle at top left, rgba(96, 165, 250, 0.28), transparent 34%),
    radial-gradient(circle at bottom right, rgba(45, 212, 191, 0.18), transparent 30%),
    linear-gradient(135deg, #0f172a 0%, #172554 48%, #eff6ff 160%);
  color: #e2e8f0;
}

.hero-kicker {
  display: inline-block;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #bfdbfe;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 20px;
  align-items: center;
}

.hero-text h1 {
  margin: 12px 0 10px;
  font-size: 40px;
  color: #ffffff;
}

.hero-text p {
  margin: 0;
  color: rgba(226, 232, 240, 0.84);
  max-width: 640px;
}

.hero-highlights {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-highlights span {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 8px 12px;
  border: 1px solid rgba(191, 219, 254, 0.24);
  background: rgba(15, 23, 42, 0.26);
  color: #dbeafe;
  font-size: 13px;
}

.hero-actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-image-wrap {
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(191, 219, 254, 0.35);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
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
  border: 1px solid rgba(191, 219, 254, 0.18);
  border-radius: 18px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
}

.metric-title {
  font-size: 13px;
  color: #cbd5e1;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
}

.metric-sub {
  font-size: 12px;
  color: #cbd5e1;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section-eyebrow {
  display: inline-flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #2563eb;
}

.domain-section {
  background:
    linear-gradient(180deg, rgba(239, 246, 255, 0.92) 0%, #ffffff 52%),
    #ffffff;
}

.chip-section {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.02) 0%, rgba(219, 234, 254, 0.84) 100%),
    #ffffff;
  border-color: #bfdbfe;
}

.section-head h2 {
  margin: 0;
  font-size: 28px;
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
  border-radius: 18px;
  padding: 16px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.domain-card:hover {
  transform: translateY(-3px);
  border-color: #93c5fd;
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.14);
}

.image-slot {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #bfdbfe;
  background: #f8fbff;
  aspect-ratio: 16 / 9;
  width: 100%;
}

.domain-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
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
  font-size: 19px;
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

.chip-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.chip-category-card {
  border: 1px solid rgba(147, 197, 253, 0.55);
  border-radius: 22px;
  padding: 20px;
  background:
    radial-gradient(circle at top right, rgba(191, 219, 254, 0.56), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(239, 246, 255, 0.95) 100%);
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  box-shadow: 0 16px 36px rgba(37, 99, 235, 0.08);
}

.chip-category-card:hover {
  border-color: #60a5fa;
  box-shadow: 0 20px 42px rgba(37, 99, 235, 0.14);
  transform: translateY(-4px);
}

.chip-category-card.is-complete {
  border-color: rgba(96, 165, 250, 0.45);
}

.chip-category-card.is-pending {
  border-color: rgba(251, 191, 36, 0.42);
  background:
    radial-gradient(circle at top right, rgba(254, 240, 138, 0.4), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 251, 235, 0.96) 100%);
}

.chip-category-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.chip-category-index {
  min-width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
}

.chip-category-card.is-pending .chip-category-index {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 12px 24px rgba(217, 119, 6, 0.24);
}

.chip-state-badge.success {
  background: rgba(219, 234, 254, 0.95);
  color: #1d4ed8;
}

.chip-state-badge.pending {
  background: rgba(254, 249, 195, 0.95);
  color: #b45309;
}

.chip-category-card-main h3 {
  margin: 0;
  font-size: 20px;
}

.chip-category-card-main p {
  margin: 8px 0 0;
  color: #475569;
  min-height: 48px;
}

.chip-category-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.chip-stat {
  border-radius: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(191, 219, 254, 0.78);
}

.chip-category-card.is-pending .chip-stat {
  background: rgba(255, 255, 255, 0.78);
  border-color: rgba(253, 230, 138, 0.9);
}

.chip-stat strong {
  display: block;
  font-size: 22px;
  color: #0f172a;
}

.chip-stat span {
  font-size: 12px;
  color: #64748b;
}

.chip-category-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-category-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #475569;
  font-size: 13px;
}

.chip-category-progress-track {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(191, 219, 254, 0.55);
}

.chip-category-progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e, #2563eb);
}

.chip-category-card.is-pending .chip-category-progress-track {
  background: rgba(253, 230, 138, 0.62);
}

.chip-category-card.is-pending .chip-category-progress-fill {
  background: linear-gradient(90deg, #f59e0b, #f97316);
}

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
  }

  .hero-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .section-head h2 {
    font-size: 25px;
  }
}

@media (max-width: 680px) {
  .hero-metrics {
    grid-template-columns: 1fr;
  }

  .hero-text h1 {
    font-size: 32px;
  }

  .chip-category-card-top,
  .chip-category-progress {
    flex-direction: column;
    align-items: flex-start;
  }

  .chip-category-stats {
    grid-template-columns: 1fr;
  }
}
</style>
