<template>
<input
  :type="params.type || 'text'"
  step="0.00001"
  :readonly="params.readonly"
  :value="value"
  @input="onChange($event)"
  @mousedown.stop
  />
</template>

<script>
export default {
  props: ['emitter', 'ikey', 'params', 'change', 'getData', 'putData'],
  data() {
    return {
      value: null
    }
  },
  methods: {
    parse(value) {
      return this.params.type === 'number' ? +value : value;
    },
    onChange(e){
      this.value = this.parse(e.target.value);
      this.update();
    },
    update() {
      if (this.ikey) {
        this.putData(this.ikey, this.value)
        this.change(this.value);
      }
      this.emitter.trigger('process');
    }
  },
  mounted() {
    const val = this.getData(this.ikey);
    
    this.value = typeof val !== "undefined" ? val : this.params.value;

    this.putData(this.ikey, this.value);
  }
}
</script>


<style lang="sass" scoped>
input
  width: 100%
  border-radius: 30px
  background-color: white
  padding: 2px 6px
  border: 1px solid #999
  font-size: 110%
  width: 150px
</style>