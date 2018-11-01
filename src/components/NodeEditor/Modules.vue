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
        clear() {
            Object.keys(this.list).map(name => delete this.list[name]);
            this.current = null;
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
