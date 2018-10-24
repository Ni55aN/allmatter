<template lang="pug">
#about
  vodal(:show="show",animation="door",@hide="hide",:closeOnEsc="true")
    .header About
    .body
      img.logo(src="~../../logo.svg")
      div Allmatter is a 3D material authoring tool.
      div Author: 
          a(target="_blank" href="https://github.com/Ni55aN") Vitaliy Stoliarov
</template>

<script>
import Vodal from 'vodal';
import eventbus from '../eventbus';

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
        eventbus.$on('showAbout', () => {
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
@import "../style/vodal.sass";

#about
  .vodal-dialog
    @extend .vodal
    max-width: 90vw
    div
      padding: 10px 0
    .logo
      width: 60%
</style>
