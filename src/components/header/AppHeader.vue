<template lang="pug">
header
  .logo
  AppMenu
  a.github(target='_blank', href='https://github.com/Ni55aN/allmatter')
  a.patron(target="_blank", href="https://www.patreon.com/ni55an") 
</template>

<script>
import store from "../../store";
import AppMenu from "./AppMenu.vue";

export default {
  data() {
    return {};
  },
  components: { AppMenu }
};
</script>

<style lang="sass">
$height: 60px
$logo-height: $height*0.8
$github-height: $height*0.7
$patreon-height: $height*0.7

header
  height: $height
  color: black
  display: flex
  align-items: center
  font-family: Gill Sans, sans-serif
  .logo
    background: url(../../../logo.svg)
    background-size: 100%
    height: $logo-height
    width: $logo-height * 4.2
    margin-left: 15px
  .github
    background: url('https://image.flaticon.com/icons/svg/25/25231.svg')
    background-size: 100%
    height: $github-height
    width: $github-height
    margin: 4px 14px
  .patron
    background: url('https://c5.patreon.com/external/logo/become_a_patron_button.png')
    background-size: 100%
    margin: 4px 14px
    height: $patreon-height
    width: 217px/51px*$patreon-height
    &:hover
      transition: .5s
      opacity: 0.8
</style>


