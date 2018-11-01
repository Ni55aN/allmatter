<template lang="pug">
#hub
  vodal(:show="show",animation="door",@hide="hide",:closeOnEsc="true")
    .header Allmatter Hub
    .body
      .statusbar
          input.search(@input="search($event.target.value)", placeholder="Search material")
          .username(v-if="userAuth") {{user.name}}
          img.signin(v-else, @click="auth",src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png")
      
      SectionMaterials(title="Current",
              :click="()=>{}"
              :materials="activeMaterials",
              :button="{click:save,text:'💾'}"
              )
      
      SectionMaterials(title="Your",
              :loading="loading",
              :click="importMaterial",
              :materials="yourMaterials",
              :button="{click:remove,text:'✗'}"
              )
      
      SectionMaterials(title="All",
              :loading="loading",
              :click="importMaterial",
              :materials="materials",
              :button="{}"
              )
        span(slot="button", slot-scope="props")
</template>
<script>
//// dsd 💾 ✗
import SectionMaterials from './SectionMaterials.vue';
import Vodal from 'vodal';
import _ from 'lodash';
import eventbus from '../../eventbus';

var domain = 'https://allmatter.herokuapp.com';

export default {
    data() {
        return {
            user: null,
            show: false,
            loading: false,
            activeMaterials: [],
            materials: []
        };
    },
    computed: {
        userAuth() {
            return this.user !== null;
        },
        yourMaterials() {
            return this.materials.filter(d => this.user && d.userId == this.user.id);
        }
    },
    methods: {
        hide() {
            this.show = false;
        },
        search: _.throttle(function(val) {
            this.loadMaterials(val);
        }, 500),
        save() {
            if (!this.userAuth) {
                alert('To save materials in the Hub you need to log in');
                return;
            }
            eventbus.$emit('preview', src => {
                eventbus.$emit('saveproject', async project => {
                    var material = {
                        title: project.name,
                        preview: src,
                        data: project.data
                    };

                    var res = await this.crossFetch('/material', 'POST', material);

                    material._id = res.data._id;
                    material.userId = this.user.id;
                    this.materials.push(material);
                });
            });
        },
        async crossFetch(path, method = 'GET', body = null) {
            this.loading = true;
            var res = await fetch(domain + path, {
                method: method,
                headers: { 'Content-type': 'application/json' },
                origin: 'http://localhost:8080',
                credentials: 'include',
                body: body instanceof Object ? JSON.stringify(body) : null
            });

            var json = await res.json();

            this.loading = false;

            if (json.status != 200) {
                alert('Request failed. See console for details');
                console.warning(json.data);
                return json;
            }
            return json;
        },
        async remove(material) {
            var res = await this.crossFetch('/material/' + material._id, 'DELETE');

            if (res.status == 200)
                this.materials = this.materials.filter(m => m._id != material._id);
        },
        importMaterial(material) {
            this.show = false;
            eventbus.$emit('openproject', material.data, material.title);
        },
        auth() {
            var url = 'https://allmatter.herokuapp.com/auth/google';
            var win = window.open(url);
            var intr = setInterval(() => {
                if (!win || win.closed) {
                    clearInterval(intr);
                    this.checkUser();
                }
            }, 300);
        },
        async checkUser() {
            var res = await this.crossFetch('/user');

            if (res.data.id && res.data.name) this.user = res.data;
        },
        async loadMaterials(filter) {
            var res = await this.crossFetch('/materials');

            if (filter) res.data = res.data.filter(d => d.title.match(filter));

            this.materials = res.data;
        }
    },
    async mounted() {
        eventbus.$on('openhub', () => {
            this.show = true;
        });

        eventbus.$on('savehub', () => {
            this.show = true;
        });
        await this.checkUser();
    //this.show = true;
    },
    watch: {
        async show() {
            if (!this.show) return;

            this.loadMaterials();

            eventbus.$emit('preview', src => {
                eventbus.$emit('saveproject', async project => {
                    this.activeMaterials = [
                        {
                            title: project.name,
                            preview: src,
                            data: project.data
                        }
                    ];
                });
            });
        }
    },
    components: {
        Vodal,
        SectionMaterials
    }
};
</script>

<style lang="sass">
@import "~vodal/common.css";
@import "~vodal/door.css";
@import "../../style/vodal.sass";

#hub
  .vodal-dialog
    @extend .vodal
    min-width: 80vw
    min-height: 90vh
    .body
      overflow-y: auto
      height: calc(100% - 30px)
      .statusbar
        padding: 15px
        height: 40px
        .search

        .username
          float: right
        .signin
          float: right
          height: 32px
</style>

