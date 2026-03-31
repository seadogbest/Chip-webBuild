<script setup>
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { domains } from "../data/domains";

const route = useRoute();
const selectedSubsystem = ref("");

const activeDomain = computed(() => domains.find((item) => item.key === route.params.domainKey));
const validDomain = computed(() => Boolean(activeDomain.value));

watch(
  activeDomain,
  (domain) => {
    if (!domain) {
      selectedSubsystem.value = "";
      return;
    }
    selectedSubsystem.value = domain.subsystems[0] ?? "";
  },
  { immediate: true }
);

function chooseSubsystem(subsystem) {
  selectedSubsystem.value = subsystem;
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

      <div class="domain-cover">
        <img v-if="activeDomain?.cover" :src="activeDomain.cover" :alt="activeDomain.title" class="cover-image" />
        <div v-else class="cover-placeholder">
          <strong>当前 Domain 图片位已预留</strong>
          <span>{{ activeDomain?.coverHint }}</span>
        </div>
      </div>

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
          <div class="mapping-flow">
            <span class="tag">整车域</span>
            <span class="tag">子系统</span>
            <span class="tag">功能模块</span>
            <span class="tag">芯片</span>
          </div>
          <div class="function-box">
            <h3>对应功能模块（Function Level）</h3>
            <div class="tag-row">
              <span v-for="func in activeDomain?.functions" :key="func" class="tag">{{ func }}</span>
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
  min-height: 200px;
  background: #f8fbff;
}

.cover-image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 200px;
  object-fit: cover;
}

.cover-placeholder {
  min-height: 200px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  color: #1e40af;
}

.cover-placeholder span {
  font-size: 12px;
  color: #64748b;
}

.subsystem-layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 14px;
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

.mapping-flow,
.tag-row {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.function-box {
  margin-top: 10px;
}

.function-box h3 {
  margin: 0;
  font-size: 16px;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1e40af;
  font-size: 12px;
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
