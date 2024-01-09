<script>
module.exports = {
  name: "contents",
  data() {
    return {
      filteredTools: []
    }
  },
  mounted() {
    this.setupTools()

    this.$watch('$root.$data.tools', this.setupTools, { deep: true })

    VueBus.$on('updateFilteredTools', this.updateFiltered)
    VueBus.$on('updateToolSorting', this.updateSorting)
  },
  methods: {
    isEven(num) {
      return num % 2 == 0;
    },
    calculateAverageOfArray(arr) {
        var total = 0;
        var count = 0;

        jQuery.each(arr, function(index, value) {
            total += value;
            count++;
        });

        return total / count;
    },
    arrayHasAnswer(arr) {
        var count = 0;
        jQuery.each(arr, function(index, value) {
            if (value !== null, value !== "") count++;
        });
        return count > 0;
    },
    calculateF(tool) {
      var F1 = tool.url_persistent == "Yes" ? 1 : 0
      var F2 = tool.documentation_available == "Yes" ? 1 : 0
      var F3 = tool.listed_other_databases == "Yes" ? 1 : 0
      
      return tool.findability_score = Math.round(((F1 + F2 + F3) / 3) * 10) * 10
    },
    calculateA(tool) {
      var A1 = 0
      if (tool.access_barrier) {
        A1 = {
          "No, direct download/access through a web link": 1,
          "User registration needed": 1,
          "Access to the tool needs to be granted (e.g. tool owner needs to give permission after user registration; tool owner sends tool after receiving a request email)": 0.5,
          "Access to the tool is evaluated before being granted, due to ethical, legal or contractual constrains (e.g. privacy, highly sensitive data)": 0.8
        }[tool.access_barrier]
      }
      var A2 = 0
      if (tool.documentation_accessible) {
        A2 = {
          "Yes": 1,
          "Some of it": 0.5,
          "No": 0,
          "Don't know": 0
        }[tool.documentation_accessible]
      }
      var A3 = 0
      if (tool.minimum_req) {
        var individual_score = []
        if (tool.minimum_req.includes("Internet connection")) individual_score.push(0.5)
        if (tool.minimum_req.includes("Desktop computer (e.g. optimized for wider screens)")) individual_score.push(1)
        if (tool.minimum_req.includes("Mobile phone (e.g. works on small screens; use the camera)")) individual_score.push(1)
        if (tool.minimum_req.includes("Open source software/programming language")) individual_score.push(1)
        if (tool.minimum_req.includes("Licensed software/programming language")) individual_score.push(0)
        if (tool.minimum_req.includes("Virtual reality headset or other specialized devices")) individual_score.push(0.2)
        if (tool.minimum_req.includes("Cross-platform tool (works in Windows, Mac and Linux)")) individual_score.push(1)
        if (tool.minimum_req.includes("Specific operating system: Windows")) individual_score.push(0.5)
        if (tool.minimum_req.includes("Specific operating system: Mac")) individual_score.push(0.5)
        if (tool.minimum_req.includes("Specific operating system: Linux")) individual_score.push(0.5)
        A3 = this.calculateAverageOfArray(individual_score)
      }
      var A4 = 0
      if (tool.languages) {
        A4 = tool.languages.length > 3 ? 1 : tool.languages.length > 1 ? 0.8 : tool.languages.length == 1 ? 0.5 : 0
      }
      var A5 = 0
      if (tool.url_training_materials) {
        A5 = 1 // needs improvement - scores 1 if any material exists
      }
      
      return tool.accessibility_score = Math.round(((A1 + A2 + A3 + A4 + A5) / 5) * 10) * 10
    },
    calculateI(tool) {

      var I1 = 0
      if (tool.software_proglanguage) {
        var individual_score = []
        for (proglang of tool.software_proglanguage) {
          var proglang_scores = {
            "C": 1,
            "C++": 1,
            "C#": 0.2,
            "Fortran": 0.2,
            "Java": 1,
            "Javascript": 1,
            "Julia": 1,
            "Matlab": 1,
            "Microsoft Excel": 0.8,
            "Perl": 0.2,
            "Python": 1,
            "R": 1,
            "Ruby": 1,
            "Ruby on Rails": 1,
            "React Native": 1,
            "TypeScript": 1,
            "Visual Basic / VBScript": 0.5,
            "Capsis platform": 1,
            "Oracle Apex": 0.2 // proprietary, paid
          }
          if (proglang in proglang_scores) {
            individual_score.push(proglang_scores[proglang])
          } else {
            console.log("[ " + tool.id + " ] Programming language [ " + proglang + " ] not in I1 scoring list.")
            individual_score.push(0)
          }
        }
        
        I1 = this.calculateAverageOfArray(individual_score)
      }

      var I2 = 0
      if (tool.input_data_protocols) {
        if (tool.input_data_protocols.includes("User enters the data directly manually")) I2 = 0
        if (tool.input_data_protocols.includes("Data entry can be partially automated programmatically (e.g. loading files with previously defined setups)")) I2 = 0.5
        if (tool.input_data_protocols.includes("Data entry can be fully automated programmatically (e.g. automatically run a script for multiple scenarios)")) I2 = 1
      }

      var I3 = 0
      if (tool.input_data_formats) {
        if (tool.input_data_protocols.includes("Widely used file formats (CSV, JSON, XML, etc.)")) I3 = 1
        if (tool.input_data_protocols.includes("HTTP (query string parameters, data in request body & file uploads)")) I3 = 1
      }

      var I4 = 0
      if (tool.output_data_formats) {
        if (tool.output_data_formats.includes("Widely used file formats (CSV, JSON, XML, etc.)")) I4 = 1
      }

      var I5 = 0
      if (tool.previous_versions_available) {
        I5 = {
          "Yes": 1,
          "No": 0,
          "Only one version exists": 0, // not scored
          "Don't know": 0
        }[tool.previous_versions_available]
      }

      var I6 = 0
      if (tool.integrated_other_tools) {
        I6 = {
          "Yes": 1,
          "No": 0,
          "Don't know": 0
        }[tool.integrated_other_tools]
      }

      var count = 4
      if (tool.input_data_formats && this.arrayHasAnswer(tool.input_data_formats)) count++
      if (tool.previous_versions_available && tool.previous_versions_available !== "Only one version exists") count++
      
      return tool.interoperability_score = Math.round(((I1 + I2 + I3 + I4 + I5 + I6) / count) * 10) * 10
    },
    calculateR(tool) {
      var R1 = 0
      var licenses = {
          "MIT License": 1,
          "Apache License 2.0": 1,
          "GNU General Public License (GPL)": 1,
          "Creative Commons BY": 1,
          "Creative Commons BY-SA": 1,
          "Creative Commons BY-NC": 0.5,
          "Creative Commons BY-NC-SA": 0.5,
          "Creative Commons BY-ND": 0.2,
          "Creative Commons BY-NC-ND": 0.2,
          "Creative Commons Zero (CC0)": 1,
          "Proprietary": 0,
          "Not stated": 0,
          "Don't know": 0
        }

      if (tool.license in licenses) {
        R1 = licenses[tool.license]
      } else {
        console.log("[ " + tool.id + " ] License [ " + tool.license + " ] not in R1 scoring list.")
      }

      var R2 = 0
      if (tool.data_provenance) {
        R2 = {
          "Yes": 1,
          "Incomplete": 0.5,
          "No": 0,
          "Don't know": 0
        }[tool.data_provenance]
      }

      var R3 = 0
      if (tool.development_process) {
        R3 = {
          "Yes": 1,
          "Not completely": 0.5,
          "No": 0,
          "Don't know": 0
        }[tool.development_process]
      }

      var R4 = 0
      if (tool.documentation_contribute) {
        R4 = {
          "Yes": 1,
          "No": 0,
          "Don't know": 0
        }[tool.documentation_contribute]
      }

      return tool.reusability_score = Math.round(((R1 + R2 + R3 + R4) / 4) * 10) * 10
    },
    updateSorting() {
      if (!('sorting' in this.$refs)) {
        return
      }
      var sorting_data = this.$refs.sorting.$data
      var sorting_option = sorting_data.sorting_options[sorting_data.selected_option]
      this.filteredTools = sorting_option.fn(this.filteredTools)
    },
    setupTools(tools) {
      if (!tools) {
        if (!this.$root.$data.tools) return
        tools = this.$root.$data.tools
      }
      this.filteredTools = tools.slice().sort((a, b) => a.name.localeCompare(b.name))
    },
    updateFiltered() {
      if (!('filtering' in this.$refs)) {
        return
      }
      var filters = this.$refs.filtering.$data.filters
      var search = this.$refs.filtering.$data.search
      this.filteredTools = Object.values(this.$root.$data.tools).filter(function(tool) {
        var yesOrNo = true

        for (const [filter_id, filter_value] of Object.entries(search)) {

          if (filter_value.length > 0) {

            toolValue = tool[filter_id]

            if (toolValue == "") {
              yesOrNo = yesOrNo && false

            } else {
              var filter = filters[filter_id]
              
              if ('answers' in filter) {

                if (filter.type.includes('array')) {
                  yesOrNo = yesOrNo && filter_value.every(a => toolValue.includes(a))
                } else {
                  yesOrNo = yesOrNo && filter_value.includes(toolValue)
                }

              } else {
                // TODO to be implemented
              }
            }
          } else {
            continue;
          }
        }
        return yesOrNo
      })
      this.updateSorting()
    },
    imageLink(tool) {
      if ('logo_url' in tool) {
        return tool.logo_url
      } else {
        return 'img/feature-image-default.svg'
      }
    }
  },
  computed: {
  }
}
</script>

<template>
  <div>
    <div class="note text-center mb-2">
      <p>This tool is in constant change. The previous version, and old database, is still available  <a target="_blank" href="https://mvarc.eu/tools/dev/digitaf_tools/">here</a>.</p>
    </div>
    <div class="row no-gutters">
      <div class="col-3">
        <div class="col-12 text-center">
          <p>Know a tool that's not in this database?<br><b>Add it through our <a href="https://forms.gle/cKwFUzGuckhfSHum6" target="_balnk">Google Form</a> or in <a href="https://github.com/euraf/AF-tools-database/blob/main/README.md#the-geek-way" target="_balnk">GitHub.</a></b></p>
        </div>
        <filtering ref="filtering" :tools="filteredTools"></filtering>
      </div>
      <div class="col-9">
        <div class="col-12 row no-gutters mb-3 sorting">
          <div class="col-6">
            <p v-if="filteredTools.length > 1">Displaying {{ filteredTools.length }} tools</p>
            <p v-if="filteredTools.length == 1">Displaying 1 tool</p>
            <p v-if="filteredTools.length == 0">No tools to display</p>
          </div>
          <sorting ref="sorting" class="col-6"></sorting>
        </div>
        <div class="col-12 row no-gutters tools">
          <div class="col-6 mb-4" :class="{ 'pr-2': isEven(idx), 'pl-2': !isEven(idx) }" v-for="tool, idx in filteredTools" :key="tool.id">
            <div class="card tool">
              <img class="card-img-top tool-cover" :src="imageLink(tool)" :alt="tool.name">
              <div class="card-body row">
                <div class="col-12">
                  <h5 class="card-title text-center"><b><router-link :to="tool.id" :tool="tool">{{ tool.name }}</router-link></b></h5>
                </div>
                <div class="col-9 text-center">
                  <p class="card-text">{{tool.description_brief}}</p>
                </div>
                <div class="col-3">
                  <table class="fair-score" cellspacing=0>
                    <tbody>
                      <tr>
                        <td><p class="h-fair-title">F</p></td>
                        <td><p class="h-fair-title">A</p></td>
                      </tr>
                      <tr>
                        <td>
                          <!-- Find -->
                          <div class="h-fair-container">
                            <img class="h-fair" :src="'img/fair_scale_new/' + calculateF(tool) +'.png'">
                            <p class="h-fair-score">{{ calculateF(tool) }}<span class="small">%</span></p>
                          </div>
                        </td>
                        <td>
                          <!-- Access -->
                          <div class="h-fair-container">
                            <img class="h-fair rotate90" :src="'img/fair_scale_new/' + calculateA(tool) + '.png'">
                            <p class="h-fair-score">{{ calculateA(tool) }}<span class="small">%</span></p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <!-- Interop -->
                          <div class="h-fair-container">
                            <img class="h-fair rotate270" :src="'img/fair_scale_new/' + calculateI(tool) + '.png'">
                            <p class="h-fair-score">{{ calculateI(tool) }}<span class="small">%</span></p>
                          </div>
                        </td>
                        <td>
                          <!-- Reuse -->
                          <div class="h-fair-container">
                            <img class="h-fair rotate180" :src="'img/fair_scale_new/' + calculateR(tool) + '.png'">
                            <p class="h-fair-score">{{ calculateR(tool) }}<span class="small">%</span></p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td><p class="h-fair-title">I</p></td>
                        <td><p class="h-fair-title">R</p></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-12 text-center my-3">
                  <p><span class="btn-crop mr-1 px-3 py-1" v-if="tool.system_components.includes('Crop')">Crop</span> <span class="btn-tree mr-1 px-3 py-1" v-if="tool.system_components.includes('Tree')">Tree</span> <span class="btn-livestock mr-1 px-3 py-1" v-if="tool.system_components.includes('Livestock')">Livestock</span> <span class="btn-people mr-1 px-3 py-1" v-if="tool.system_components.includes('People')">People</span></p>
                </div>
                <div class="col-6 text-center">
                  <p class="btn-small-title">Spatial scale</p>
                  <p v-for="(scale, index) in tool.spatial_scales" :key="index">{{ scale }}</p>
                </div>
                <div class="col-6 text-center">
                  <p class="btn-small-title">Time step</p>
                  <p v-for="(time, index) in tool.time_steps" :key="index">{{ time }}</p>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>