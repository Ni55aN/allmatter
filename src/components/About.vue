<template lang="pug">
vodal(:show="show",animation="door",@hide="hide",:closeOnEsc="true")
  .header About
  .body 
    img.logo(src="~../../logo.svg")
    div Allmatter is a 3D material authoring tool.
    div Author: 
        a(target="_blank" href="https://github.com/Ni55aN") Vitaliy Stoliarov
</template>


<script>
import Vodal from "vodal";
import eventbus from "../eventbus";

export default {
  data() {
    return { show: false };
  },
  methods: {
    hide() {
      this.show = false;
    }
  },
  mounted() {
    eventbus.$on("showAbout", () => {
      this.show = true;
    });
  },
  components: {
    Vodal
  }
};
</script>

<style lang="sass">
@import "~vodal/common.css";
@import "~vodal/door.css";
.vodal-dialog
  font-family: Gill Sans, sans-serif
  .header
    font-size: 17px
    padding-bottom: 10px
    border-bottom: 1px solid #e9e9e9
  .body
    color: #a1a1a1
    padding-top: 15px
    font-size: 16px
    .logo
      width: 60%
    div
      padding: 10px 0
    a
      color: #717171
</style>
