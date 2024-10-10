<script>
export default {
  data() {
    return {
      nodeData: [{ label: 'table页面', props: { path: '/table-page' } }]
    };
  }
};
</script>

<template>
  <div class="container">
    <aside>
      <router-link
        v-for="node in nodeData"
        :key="node.label"
        :to="node.props?.path"
      >
        {{ node.label }}
      </router-link>
    </aside>
    <main style>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;

  aside {
    width: 200px;
    display: flex;
    flex-direction: column;
  }

  main {
    max-width: calc(100% - 200px);
    flex: 1;
  }
}
</style>
