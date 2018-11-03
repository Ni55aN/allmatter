<template lang="pug">
.item(
  @click.prevent="$emit('select')"
  @contextmenu.prevent="enter"
  @keydown.enter="enter"
)
  input.text(
    v-if="editMode",
    :value="name",
    @blur="exit",
    v-focus=""
    )
  .text(v-else) {{name}}
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
    },
    directives: {
        focus: {
            inserted(el) {
                el.focus();
            }
        }
    }
}
</script>

<style lang="sass" scoped>
$padd: 8px
$marg: 20px
$fcolor: #afa2c4

.item
  padding: 4px
  width: 140px
  .text
    font-size: 1rem
    margin-right: $marg
    cursor: pointer
    color: $fcolor
    padding: $padd*0.7 $padd
    border: 1px solid #bbb
    border-radius: $padd*2
    background: rgba(255,255,255,0.8)
    width: 100%
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    &:hover
      color: grey
      cursor: pointer
</style>
