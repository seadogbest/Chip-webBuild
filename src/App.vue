<script setup>
import { RouterView } from "vue-router";
import { siteMeta } from "./data/domains";
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
  </div>
</template>
