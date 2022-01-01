<template>
  <a-layout class="layout">
    <a-layout-sider class="header">
      <div class="header-logo">
        <img
          :src="require('../assets/icons/logo.png')"
          alt="logo"
        >
        <span>네이버중국어사전</span>
      </div>
      <a-menu
        :default-selected-keys="['1']"
        :default-open-keys="['sub1']"
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
      >
        <a-menu-item key="1">
          <a-icon type="book" />
          <span>단어장</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content class="content">
      <slot />
    </a-layout-content>
  </a-layout>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Welcome!',
    }
  },
}
</script>

<style lang="scss">
.content {
  padding: 15px 15px 15px 230px;
}
.header {
  position: fixed !important;
  height:100%;
  min-height: 100vh !important;
  box-shadow: 2px 0 6px rgba(0,21,41,.35);
  background-color:#001529;
  color:rgba(255, 255, 255, 1);

  .header-logo {
    padding:16px;

    img {
      width:26px;
      vertical-align: middle;
      margin-right:10px;
      border-radius:3px;
    }
    span {
      vertical-align: middle;
      font-weight: bold;
    }
  }
}

</style>
