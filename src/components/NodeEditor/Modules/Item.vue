<template lang="pug">
.item(
  @click.prevent="$emit('select')"
  @contextmenu.prevent="enter"
  @keydown.enter="enter"
)
  input(
    v-if="editMode"
    :value="name"
    @blur="exit"
    )
  span(v-else) {{name}}
</template>

<script>
export default {
    props: ['name', 'select'],
    data() {
        return {
            editMode: false
        }
    },
    methods: {
        enter() {
            this.editMode = true;
        },
        exit(e) {
            this.editMode = false;
            this.$emit('rename', { from: this.name, to: e.target.value });
        }
    }
}
</script>

<style lang="sass" scoped>
.item
  padding: 8px
  width: 140px
  input, span
    color: #50a8ff
    font-size: 1rem
    padding: 0
    // border: 0
    &:hover
      color: grey
      cursor: pointer
</style>
