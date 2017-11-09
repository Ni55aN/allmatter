<template lang="pug">
.module-stack 
  .item(v-for="(item,i) in items")
    input(@contextmenu.prevent="edited = i",
        @click="edited !== i?clickitem(i,$event.target):null"
        @input="setitem(i,$event.target.value)",
        @keydown.enter.prevent="edited=null;$event.target.blur()",
        @blur="edited=null",
        @mousedown.stop="",
        :style="inputWidth(item)",
        :value="item"
        )
</template>

<script>
import eventbus from "../../eventbus";

export default {
  props: ["items"],
  data() {
    return {
      edited: null
    };
  },
  methods: {
    inputWidth(item){
      return {width:(20+item.length*8)+'px'}
    },
    clickitem(i,el) {
      this.$emit("clickitem", i);
      el.blur();

    },
    setitem(i, val) {
      this.$emit("renameitem", i, val);
    }
  },
  mounted() {}
};
</script>


<style lang="sass">

$padd: 8px
$marg: 20px
$fcolor: #afa2c4

.module-stack
  position: absolute
  z-index: 3
  left: 15px
  top: 20px
  font-family: Gill Sans, sans-serif
  .item
    display: inline-block
    position: relative
    color: $fcolor
    input
      margin-right: $marg
      cursor: pointer
      font-size: 14px
      color: $fcolor
      padding: $padd*0.7 $padd
      border: 1px solid #bbb
      border-radius: $padd*2
      background: rgba(255,255,255,0.8)
      &:hover
        color: #56a
    &:after
      content: '›'
      font-size: 1.5em
      position: absolute
      right: $marg/3
      top: 0%
    &:last-child:after
      content: ''

</style>

