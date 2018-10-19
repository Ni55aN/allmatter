<template lang="pug">
header
  .logo
  AppMenu
  a.github(target='_blank', href='https://github.com/Ni55aN/allmatter')
  a.patron(target="_blank", href="https://www.patreon.com/ni55an") 
</template>

<script>
import AppMenu from "./AppMenu.vue";

export default {
  data() {
    return {};
  },
  components: { AppMenu }
};
</script>

<style lang="sass">
@import '../../style/media';

$height: 50px
$logo-height: $height*0.8
$logo-width: $logo-height * 4.2
$github-height: $height*0.7
$patreon-height: $height*0.7
$patreon-width: 217px/51px*$patreon-height

$sm: 0.5 // scale mobile
$md: 0.75 // tablet

header
  height: $height
  color: black
  display: flex
  align-items: center
  font-family: Gill Sans, sans-serif
  padding: 0 2vh
  .logo
    background: url(../../../logo.svg)
    background-size: 100%
    height: $logo-height
    width: $logo-width
    min-width: $logo-width
    +mobile
      height: $logo-height*$sm
      width: $logo-width*$sm
      min-width: $logo-width*$sm
    +tablet
      height: $logo-height*$md
      width: $logo-width*$md
      min-width: $logo-width*$md
  .github
    background: url('https://image.flaticon.com/icons/svg/25/25231.svg')
    background-size: 100%
    height: $github-height
    width: $github-height
    min-width: $github-height
    margin: 4px 14px
    +mobile
      margin: 4px 4px
      height: $github-height*$sm
      width: $github-height*$sm
      min-width: $github-height*$sm
    +tablet
      margin: 4px 8px
      height: $github-height*$md
      width: $github-height*$md
      min-width: $github-height*$md
  .patron
    background: url('https://c5.patreon.com/external/logo/become_a_patron_button.png')
    background-size: 100%
    margin: 4px 0 4px 14px
    height: $patreon-height
    width: $patreon-width
    min-width: $patreon-width
    +mobile
      height: $patreon-height*$sm
      width: $patreon-width*$sm
      min-width: $patreon-width*$sm
      margin: 4px 0 4px 4px
    +tablet
      height: $patreon-height*$md
      width: $patreon-width*$md
      min-width: $patreon-width*$md
      margin: 4px 0 4px 8px
    &:hover
      transition: .5s
      opacity: 0.8
</style>


