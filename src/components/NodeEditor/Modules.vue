<template lang="pug">
.modules
  .item(v-for="(module, name) in list" @click="openModule(name)") {{name}}
  button(@click="addModule()") Add
</template>

<script>
import { ID } from '../../consts'
import Vue from 'vue';

var initialData = () => ({id: ID, nodes: {}});

export default {
    props: ['opened'],
    inject: ['getEditor'],
    data() {
        return {
            current: null,
            list: {}
        }
    },
    computed: {
        editor() {
            return this.getEditor();
        }
    },
    methods: {
        sync() {
            this.list[this.current].data = this.editor.toJSON();
        },
        async openModule(name) {
            this.current = name;
            await this.editor.fromJSON(this.list[name].data);
            this.$emit('opened');
        },
        addModule(name, data) {
            name = name || 'module'+Object.keys(this.list).length;
            data = data || initialData();

            Vue.set(this.list, name, { data });
        },
        getCurrent() {
            return this.list[this.current];
        },
        async clear() {
            Object.keys(this.list).map(name => Vue.delete(this.list, name));
            this.current = null;
            await this.editor.fromJSON({
                id: ID,
                nodes: {},
                groups: {}
            });
        }
    },
    mounted() {
        Vue.set(this.list, 'unnamed', { name: 'unnamed', data: initialData() });
        this.current = 'unnamed';
    }
}
</script>

<style lang="sass" scoped>
.modules
  position: absolute
  left: 1%
  top: 1%
  font-family: Gill Sans, sans-serif
  .item
    padding: 8px
    color: #50a8ff
    &:hover
      color: grey
      cursor: pointer
  button
    background: white
    padding: 4px
    border: none
    width: 100%
    color: #555
    &:hover
      background: #eee
    color: #222
</style>
