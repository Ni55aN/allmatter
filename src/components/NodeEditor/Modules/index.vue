<template lang="pug">
.modules
  Item(
    v-for="name in sorted"
    :name="name"
    @select="openModule(name)"
    @rename="rename($event.from, $event.to)"
  )
  button(@click="addModule()") +
</template>

<script>
import { ID } from '../../../consts';
import Item from './Item.vue';
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
        },
        sorted() {
            return Object.keys(this.list)
                .sort((a, b) => a < b ? -1 : 1);
        }
    },
    methods: {
        sync() {
            this.list[this.current].data = this.editor.toJSON();
        },
        rename(from, to) {
            const item = this.list[from];

            Vue.delete(this.list, from);
            Vue.set(this.list, to, item);

            if (this.current === from)
                this.current = to;
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
        Vue.set(this.list, 'main', { name: 'main', data: initialData() });
        this.current = 'main';
    },
    components: {
        Item
    }
}
</script>

<style lang="sass" scoped>
.modules
  position: absolute
  left: 12px
  top: 12px
  font-family: Gill Sans, sans-serif
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
