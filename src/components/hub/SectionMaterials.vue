<template lang="pug">
section.materials
    h3 {{title}}
    .cssload-container(v-if="loading")
        .cssload-whirlpool
    span(v-if="materials.length==0") Empty
    .item(v-for="material in materials", @click="click(material)")
        slot(name="title", :title="material.title")
            .title {{material.title}}
        slot(name="button")
            .button(@click.stop="button.click(material)") {{button.text}}
        img(:src="material.preview")  
</template>

<script>
export default {
  props: ["loading", "title", "materials", "click", "button"],
  data() {
    return {};
  }
};
</script>

<style lang="sass">
@import '../../style/common.sass';

section.materials
    .item
        display: inline-block
        width: 20%
        padding-top: 20%
        padding-bottom: 0
        position: relative
        overflow: hidden
        &:hover .button
            opacity: 1
        .title,.button
            position: absolute
            color: white
            background: rgba(0,0,0,0.5)
            border-radius: 10px
            padding: 2px 10px
            z-index: 2
        .title
            left: 5%
            bottom: 0  
            max-width: 90%
            overflow: hidden
            text-overflow: ellipsis
        img
            position: absolute
            height: 100%
            left: 50%
            top: 0 
            transform: translateX(-50%);
            z-index: 1
        .button
            top: 8px
            right: 8px
            font-size: 24px
            cursor: pointer
            padding: 2px 6px
            opacity: 0.2
</style>
