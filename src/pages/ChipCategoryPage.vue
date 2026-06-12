<script setup>
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { chipFunctionCategories, getChipRecordsByCategory } from "../data/chips";

const route = useRoute();

const activeCategory = computed(() => chipFunctionCategories.find((item) => item.key === route.params.categoryKey));
const categoryRecords = computed(() => {
  if (!activeCategory.value) {
    return [];
  }
  return getChipRecordsByCategory(activeCategory.value.key);
});
const manufacturerCount = computed(
  () => new Set(categoryRecords.value.map((record) => record.manufacturer).filter(Boolean)).size
);
const groupedRecords = computed(() => {
  const groups = new Map();
  for (const record of categoryRecords.value) {
    const groupKey = record.secondaryCategory || "未分类";
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey).push(record);
  }
  return Array.from(groups.entries()).map(([secondaryCategory, records]) => ({
    secondaryCategory,
    records
  }));
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
    <section v-if="activeCategory" class="panel chip-page">
      <div class="section-head with-action">
        <div>
          <div class="breadcrumb">首页 / 芯片功能分类 / {{ activeCategory.title }}</div>
          <h1>{{ activeCategory.title }}</h1>
          <p>{{ activeCategory.summary }}</p>
        </div>
        <RouterLink to="/" class="btn ghost">返回首页</RouterLink>
      </div>

      <section class="category-summary-grid">
        <article class="summary-card">
          <div class="summary-label">一级分类</div>
          <div class="summary-value">{{ activeCategory.title }}</div>
        </article>
        <article class="summary-card">
          <div class="summary-label">芯片厂商数</div>
          <div class="summary-value">{{ manufacturerCount }}</div>
        </article>
        <article class="summary-card">
          <div class="summary-label">芯片条目数</div>
          <div class="summary-value">{{ categoryRecords.length }}</div>
        </article>
      </section>

      <section v-if="groupedRecords.length" class="chip-groups">
        <article v-for="group in groupedRecords" :key="group.secondaryCategory" class="chip-group">
          <div class="group-head">
            <div>
              <h2>{{ group.secondaryCategory }}</h2>
              <p>按 Excel 中的二级分类自动归组展示。</p>
            </div>
            <span class="badge">{{ group.records.length }} 个芯片</span>
          </div>

          <div class="chip-record-grid">
            <article v-for="record in group.records" :key="record.id || `${group.secondaryCategory}-${record.model}`" class="chip-record-card">
              <div class="chip-record-top">
                <div>
                  <div class="record-label">芯片型号</div>
                  <h3>{{ record.model }}</h3>
                </div>
                <span class="badge">{{ record.manufacturer || "厂商待补充" }}</span>
              </div>
              <dl class="record-meta">
                <div>
                  <dt>芯片厂商</dt>
                  <dd>{{ record.manufacturer || "-" }}</dd>
                </div>
                <div>
                  <dt>晶圆厂</dt>
                  <dd>{{ record.foundry || "-" }}</dd>
                </div>
                <div>
                  <dt>一级分类</dt>
                  <dd>{{ activeCategory.title }}</dd>
                </div>
                <div>
                  <dt>二级分类</dt>
                  <dd>{{ record.secondaryCategory || "-" }}</dd>
                </div>
              </dl>
              <a
                v-if="record.datasheetUrl"
                class="datasheet-link"
                :href="record.datasheetUrl"
                target="_blank"
                rel="noreferrer noopener"
              >
                <span>查看 Datasheet</span>
                <span>{{ getSourceDomain(record.datasheetUrl) }}</span>
              </a>
              <div v-else class="datasheet-link disabled">Datasheet 链接待补充</div>
            </article>
          </div>
        </article>
      </section>

      <section v-else class="empty-state">
        <h2>当前分类暂无芯片数据</h2>
        <p>页面结构已搭建完成，后续将 Excel 数据导入 `src/data/chips.js` 后即可自动展示。</p>
        <div class="empty-fields">
          <span class="badge">芯片厂商</span>
          <span class="badge">芯片型号</span>
          <span class="badge">芯片一级分类</span>
          <span class="badge">芯片二级分类</span>
          <span class="badge">晶圆厂中文简称</span>
          <span class="badge">Datasheet 链接</span>
        </div>
      </section>
    </section>

    <section v-else class="panel">
      <div class="empty-state">
        <h2>未找到该芯片分类</h2>
        <p>请返回首页重新选择“芯片功能分类”。</p>
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

.chip-page {
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

.category-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  border: 1px solid #dbeafe;
  border-radius: 14px;
  background: #f8fbff;
  padding: 14px;
}

.summary-label {
  font-size: 13px;
  color: #64748b;
}

.summary-value {
  margin-top: 6px;
  font-size: 24px;
  font-weight: 700;
  color: #1d4ed8;
}

.chip-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chip-group {
  border: 1px solid #dbeafe;
  border-radius: 16px;
  padding: 16px;
  background: #ffffff;
}

.group-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.group-head h2 {
  margin: 0;
  font-size: 20px;
}

.group-head p {
  margin: 6px 0 0;
  color: #64748b;
}

.chip-record-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.chip-record-card {
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  padding: 14px;
  background: linear-gradient(180deg, #ffffff, #f8fbff);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chip-record-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.record-label {
  font-size: 12px;
  color: #64748b;
}

.chip-record-top h3 {
  margin: 4px 0 0;
  font-size: 18px;
}

.record-meta {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
}

.record-meta div {
  margin: 0;
}

.record-meta dt {
  font-size: 12px;
  color: #64748b;
}

.record-meta dd {
  margin: 4px 0 0;
  color: #0f172a;
  font-weight: 500;
}

.datasheet-link {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid #bae6fd;
  border-radius: 10px;
  padding: 10px 12px;
  background: #f0f9ff;
  color: #0369a1;
  text-decoration: none;
}

.datasheet-link.disabled {
  color: #94a3b8;
  background: #f8fafc;
  border-color: #e2e8f0;
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

.empty-fields {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

@media (max-width: 960px) {
  .category-summary-grid,
  .record-meta {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .section-head.with-action,
  .group-head,
  .chip-record-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-head h1 {
    font-size: 26px;
  }
}
</style>
