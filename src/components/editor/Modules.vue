<template lang="pug">
.modules
  .item(v-for="(module, name) in list" @click="openModule(name)") {{name}}
  button(@click="addModule()") Add
</template>


<script>
import Vue from 'vue';
import { ID } from '../../consts'

var initialData = () => ({id: ID, nodes: {}});

export default {
  props: ['opened'],
  inject: ['getEditor'],
  data() {
    return {
      current: 'unnamed',
      list: {
        unnamed: { name: "unnamed", data: initialData() }
      }
    }
  },
  computed: {
    editor() {
      return this.getEditor();
    }
  },
  watch: {
    async current(curr, prev) {
      if(prev)
        this.list[prev].data = this.editor.toJSON();
        console.log(this.list)

      await this.editor.fromJSON(this.list[curr].data);
      this.$emit('opened');
    }
  },
  methods: {
    async openModule(module) {
      this.current = module;
      this.$emit('opened');
    },
    addModule() {
      Vue.set(this.list, 'module'+Object.keys(this.list).length, { data: initialData() });
    },
    getCurrent() {
      return this.list[this.current];
    }
  }
}
</script>


<style lang="sass" scoped>
.modules
  position: absolute
  left: 0
  top: 0
  .item
    padding: 5px
    &:hover
      color: grey
      cursor: pointer
  button
    background: white
    border: 1px solid black
    width: 100%
</style>
