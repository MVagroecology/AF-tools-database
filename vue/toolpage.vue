<script>
// component creation
module.exports = {
  name: "toolpage",
  data() {
    return {
      tool: null
    }
  },
  created() {
		this.updateInfo(this.$root.$data.tools)
    this.$watch('$root.$data.tools', this.updateInfo, { deep: true })
  },
  methods: {
    updateInfo(tools) {
      if (!tools) return
      var hasTool = tools.filter(tool => tool.id === this.$route.params.id)
      if (hasTool.length == 1) this.tool = hasTool[0]
      if (hasTool.length == 0) console.log(this.$route.params.id + " does not exist.")
      if (hasTool.length > 1) console.log(this.$route.params.id + " has duplicate entries.")

    },
    imageLink(tool) {
      if ('logo_url' in tool) {
        return tool.logo_url
      } else {
        return 'img/feature-image-default.svg'
      }
    }
  }
}
</script>

<template>
  <div class="card tool" v-if="tool">
    <img class="card-img-top" :src="imageLink(tool)" :alt="tool.name">
    <div class="card-body row">
      <div class="col-12">
        <h5 class="card-title text-center"><b><router-link :to="tool.id">{{ tool.name }}</router-link></b></h5>
      </div>
      <div class="col-9 text-center">
        <p class="card-text">{{tool.description_brief}}</p>
      </div>
      <div class="col-12 text-center my-3">
        <p><span class="btn-crop mr-1 px-3 py-1" v-if="tool.system_components.includes('Crop')">Crop</span> <span class="btn-tree mr-1 px-3 py-1" v-if="tool.system_components.includes('Tree')">Tree</span> <span class="btn-livestock mr-1 px-3 py-1" v-if="tool.system_components.includes('Livestock')">Livestock</span> <span class="btn-people mr-1 px-3 py-1" v-if="tool.system_components.includes('People')">People</span></p>
      </div>
      <div class="col-6 text-center">
        <p class="btn-small-title">Spatial scale</p>
        <p v-for="(scale, index) in tool.spatial_scales" :key="index">{{ scale }}</p>
      </div>
      <div class="col-6 text-center">
        <p class="btn-small-title">Time scale</p>
        <p v-for="(scale, index) in tool.time_scales" :key="index">{{ scale }}</p>
      </div>
      <div class="col-6 text-center">
        <p class="btn-small-title">Stack</p>
        <p v-for="(scale, index) in tool.software_proglanguage" :key="index">{{ scale }}</p>
      </div>
      <div class="col-6 text-center">
        <p class="btn-small-title">License</p>
        <p>{{ tool.license }}</p>
      </div>
    </div>
  </div>
</template>