<script setup>
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { chipFunctionCategories, getChipRecordsByCategory } from "../data/chips";

const PAGE_SIZE = 20;

const route = useRoute();
const selectedManufacturer = ref("");
const selectedSecondaryCategory = ref("");
const searchKeyword = ref("");
const currentPage = ref(1);

const activeCategory = computed(() => chipFunctionCategories.find((item) => item.key === route.params.categoryKey));
const categoryRecords = computed(() => {
  if (!activeCategory.value) {
    return [];
  }
  return getChipRecordsByCategory(activeCategory.value.key);
});
const manufacturerOptions = computed(() =>
  Array.from(new Set(categoryRecords.value.map((record) => record.manufacturer).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "zh-Hans-CN")
  )
);
const secondaryCategoryOptions = computed(() =>
  Array.from(new Set(categoryRecords.value.map((record) => record.secondaryCategory).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "zh-Hans-CN")
  )
);
const manufacturerCount = computed(
  () => new Set(categoryRecords.value.map((record) => record.manufacturer).filter(Boolean)).size
);
const filteredRecords = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();
  return categoryRecords.value.filter((record) => {
    const matchesManufacturer = !selectedManufacturer.value || record.manufacturer === selectedManufacturer.value;
    const matchesSecondaryCategory =
      !selectedSecondaryCategory.value || record.secondaryCategory === selectedSecondaryCategory.value;
    const matchesKeyword = !keyword || record.model.toLowerCase().includes(keyword);
    return matchesManufacturer && matchesSecondaryCategory && matchesKeyword;
  });
});
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecords.value.length / PAGE_SIZE)));
const paginatedRecords = computed(() => {
  const startIndex = (currentPage.value - 1) * PAGE_SIZE;
  return filteredRecords.value.slice(startIndex, startIndex + PAGE_SIZE);
});
const pageRangeText = computed(() => {
  if (!filteredRecords.value.length) {
    return "0-0";
  }
  const start = (currentPage.value - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage.value * PAGE_SIZE, filteredRecords.value.length);
  return `${start}-${end}`;
});
const datasheetCount = computed(() => categoryRecords.value.filter((record) => Boolean(record.datasheetUrl)).length);
const pendingCount = computed(() => Math.max(0, categoryRecords.value.length - datasheetCount.value));
const completionRate = computed(() =>
  categoryRecords.value.length ? Math.round((datasheetCount.value / categoryRecords.value.length) * 100) : 0
);
const groupedRecords = computed(() => {
  const groups = new Map();
  for (const record of paginatedRecords.value) {
    const groupKey = record.secondaryCategory || "未分类";
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey).push(record);
  }
  return Array.from(groups.entries()).map(([secondaryCategory, records]) => {
    const availableCount = records.filter((record) => Boolean(record.datasheetUrl)).length;

    return {
      secondaryCategory,
      records,
      availableCount,
      pendingCount: Math.max(0, records.length - availableCount)
    };
  });
});

function isLocalDatasheet(url) {
  return url?.startsWith("/data/chip_pdf/");
}

function getSourceDomain(url) {
  if (!url) {
    return "";
  }
  if (isLocalDatasheet(url)) {
    return "本地PDF";
  }
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (_error) {
    return "";
  }
}

function getDatasheetHint(record) {
  return record.datasheetNote || "待芯片原厂补充";
}

function resetFilters() {
  selectedManufacturer.value = "";
  selectedSecondaryCategory.value = "";
  searchKeyword.value = "";
}

function goToPreviousPage() {
  currentPage.value = Math.max(1, currentPage.value - 1);
}

function goToNextPage() {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
}

watch(filteredRecords, () => {
  currentPage.value = 1;
});
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
        <article class="summary-card accent">
          <div class="summary-label">真实资料覆盖</div>
          <div class="summary-value">{{ completionRate }}%</div>
          <div class="summary-sub">{{ datasheetCount }} 个有真实资料 / {{ pendingCount }} 个待补充</div>
        </article>
      </section>

      <section class="panel filter-panel">
        <div class="filter-head">
          <div>
            <h2>筛选与搜索</h2>
            <p>支持按芯片厂家筛选，并按型号关键字搜索当前一级分类下的芯片。</p>
          </div>
          <button type="button" class="btn ghost" @click="resetFilters">重置条件</button>
        </div>
        <div class="filter-grid">
          <label class="filter-field">
            <span class="field-label">按厂家筛选</span>
            <select v-model="selectedManufacturer" class="select">
              <option value="">全部厂家</option>
              <option v-for="manufacturer in manufacturerOptions" :key="manufacturer" :value="manufacturer">
                {{ manufacturer }}
              </option>
            </select>
          </label>
          <label class="filter-field">
            <span class="field-label">按二级分类筛选</span>
            <select v-model="selectedSecondaryCategory" class="select">
              <option value="">全部二级分类</option>
              <option
                v-for="secondaryCategory in secondaryCategoryOptions"
                :key="secondaryCategory"
                :value="secondaryCategory"
              >
                {{ secondaryCategory }}
              </option>
            </select>
          </label>
          <label class="filter-field">
            <span class="field-label">搜索芯片型号</span>
            <input
              v-model="searchKeyword"
              type="search"
              class="input"
              placeholder="例如：RK3588 / T7 / CAL77"
            />
          </label>
          <article class="filter-result-card">
            <div class="summary-label">筛选结果</div>
            <div class="summary-value">{{ filteredRecords.length }}</div>
            <div class="filter-result-sub">当前条件下的芯片条目数，每页 {{ PAGE_SIZE }} 条</div>
          </article>
        </div>
      </section>

      <section v-if="groupedRecords.length" class="chip-groups">
        <article v-for="group in groupedRecords" :key="group.secondaryCategory" class="chip-group">
          <div class="group-head">
            <div>
              <h2>{{ group.secondaryCategory }}</h2>
              <p>芯片厂家、型号与 DataSheet 链接均来自你导入的 Excel。</p>
            </div>
            <div class="group-meta">
              <span class="badge">{{ group.records.length }} 个芯片</span>
              <span class="badge success">{{ group.availableCount }} 个有资料</span>
              <span class="badge pending">{{ group.pendingCount }} 个待补充</span>
            </div>
          </div>

          <div class="chip-record-grid">
            <component
              :is="record.datasheetUrl ? 'a' : 'article'"
              v-for="record in group.records"
              :key="record.id || `${group.secondaryCategory}-${record.model}`"
              class="chip-record-card"
              :class="{
                clickable: Boolean(record.datasheetUrl),
                disabled: !record.datasheetUrl,
                'has-datasheet': Boolean(record.datasheetUrl),
                'missing-datasheet': !record.datasheetUrl
              }"
              :href="record.datasheetUrl || undefined"
              :target="record.datasheetUrl ? '_blank' : undefined"
              :rel="record.datasheetUrl ? 'noreferrer noopener' : undefined"
            >
              <div class="record-status-line">
                <span class="record-status-pill" :class="record.datasheetUrl ? 'available' : 'pending'">
                  {{ record.datasheetUrl ? "真实资料可查看" : "资料待补充" }}
                </span>
                <span class="record-category-pill">{{ record.secondaryCategory || "未分类" }}</span>
              </div>
              <div class="chip-record-top">
                <div>
                  <div class="record-label">芯片型号</div>
                  <h3>{{ record.model }}</h3>
                </div>
                <span class="badge">{{ record.manufacturer || "厂家待补充" }}</span>
              </div>
              <dl class="record-meta">
                <div>
                  <dt>芯片厂商</dt>
                  <dd>{{ record.manufacturer || "-" }}</dd>
                </div>
                <div>
                  <dt>一级分类</dt>
                  <dd>{{ activeCategory.title }}</dd>
                </div>
                <div class="record-highlight">
                  <dt>资料来源</dt>
                  <dd>{{ record.datasheetUrl ? getSourceDomain(record.datasheetUrl) : getDatasheetHint(record) }}</dd>
                </div>
              </dl>
              <div v-if="record.datasheetUrl" class="datasheet-link" :class="{ local: isLocalDatasheet(record.datasheetUrl) }">
                <span>{{ isLocalDatasheet(record.datasheetUrl) ? '查看本地 PDF' : '查看 Datasheet' }}</span>
                <span>{{ getSourceDomain(record.datasheetUrl) }}</span>
              </div>
              <div v-else class="datasheet-link disabled">
                <span>暂未收录资料链接</span>
                <span>{{ getDatasheetHint(record) }}</span>
              </div>
            </component>
          </div>
        </article>
      </section>

      <section v-if="filteredRecords.length" class="pagination-bar">
        <div class="pagination-meta">
          <span>当前第 {{ currentPage }} / {{ totalPages }} 页</span>
          <span>显示 {{ pageRangeText }} 条，共 {{ filteredRecords.length }} 条</span>
        </div>
        <div class="pagination-actions">
          <button type="button" class="btn ghost" :disabled="currentPage === 1" @click="goToPreviousPage">
            上一页
          </button>
          <button
            type="button"
            class="btn ghost"
            :disabled="currentPage === totalPages"
            @click="goToNextPage"
          >
            下一页
          </button>
        </div>
      </section>

      <section v-else class="empty-state">
        <h2>当前分类暂无芯片数据</h2>
        <p>当前一级分类下没有符合筛选条件的芯片记录。</p>
        <div class="empty-fields">
          <span class="badge">芯片厂商</span>
          <span class="badge">芯片型号</span>
          <span class="badge">芯片一级分类</span>
          <span class="badge">芯片二级分类</span>
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

.filter-panel {
  padding: 18px;
}

.filter-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.filter-head h2 {
  margin: 0;
  font-size: 18px;
}

.filter-head p {
  margin: 6px 0 0;
  color: #64748b;
}

.filter-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  align-items: end;
}

.filter-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  margin-bottom: 6px;
  font-size: 13px;
  color: #475569;
}

.filter-result-card {
  border: 1px solid #dbeafe;
  border-radius: 14px;
  background: #f8fbff;
  padding: 12px 14px;
}

.filter-result-sub {
  font-size: 12px;
  color: #64748b;
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  border: 1px solid #dbeafe;
  border-radius: 14px;
  background: #f8fbff;
  padding: 14px;
}

.summary-card.accent {
  background:
    radial-gradient(circle at top right, rgba(191, 219, 254, 0.55), transparent 36%),
    linear-gradient(180deg, #eff6ff, #ffffff);
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

.summary-sub {
  margin-top: 6px;
  font-size: 12px;
  color: #475569;
}

.chip-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #dbeafe;
  border-radius: 14px;
  background: #f8fbff;
}

.pagination-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #475569;
  font-size: 14px;
}

.pagination-actions {
  display: flex;
  gap: 10px;
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

.group-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
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
  border-radius: 18px;
  padding: 16px;
  background: linear-gradient(180deg, #ffffff, #f8fbff);
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: inherit;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
}

.chip-record-card.clickable {
  cursor: pointer;
  transition: 0.2s ease;
}

.chip-record-card.clickable:hover {
  border-color: #60a5fa;
  transform: translateY(-4px);
  box-shadow: 0 18px 34px rgba(37, 99, 235, 0.16);
}

.chip-record-card.disabled {
  background: linear-gradient(180deg, #ffffff, #f8fafc);
}

.chip-record-card.has-datasheet {
  border-color: rgba(96, 165, 250, 0.55);
  background:
    radial-gradient(circle at top right, rgba(125, 211, 252, 0.26), transparent 30%),
    linear-gradient(180deg, #ffffff, #f0f9ff);
}

.chip-record-card.missing-datasheet {
  border-color: rgba(251, 191, 36, 0.4);
  background:
    radial-gradient(circle at top right, rgba(254, 240, 138, 0.28), transparent 32%),
    linear-gradient(180deg, #ffffff, #fffbeb);
}

.record-status-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.record-status-pill,
.record-category-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  white-space: nowrap;
}

.record-status-pill.available {
  background: rgba(219, 234, 254, 0.95);
  color: #1d4ed8;
}

.record-status-pill.pending {
  background: rgba(254, 249, 195, 0.95);
  color: #b45309;
}

.record-category-pill {
  background: rgba(241, 245, 249, 0.95);
  color: #475569;
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
  font-size: 20px;
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

.record-highlight {
  grid-column: 1 / -1;
  padding-top: 2px;
}

.datasheet-link {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid #c7d2fe;
  border-radius: 10px;
  padding: 10px 12px;
  background: #eef2ff;
  color: #4338ca;
}

.datasheet-link.local {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #166534;
}

.datasheet-link.disabled {
  color: #92400e;
  background: #fff7ed;
  border-color: #fed7aa;
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
  .record-meta,
  .filter-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .section-head.with-action,
  .group-head,
  .group-meta,
  .record-status-line,
  .chip-record-top,
  .filter-head,
  .pagination-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-head h1 {
    font-size: 26px;
  }
}
</style>
