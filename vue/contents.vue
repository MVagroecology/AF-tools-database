<script>
// component creation
module.exports = {
  name: "contents",
  data() {
    return {
      tools: [],
      filteredTools: [],
      isReady: false,
      stack: null,
      software_proglanguage: [
        "C",
        "C++",
        "C#",
        "Fortran",
        "Java",
        "Javascript",
        "Julia",
        "Matlab",
        "Microsoft Excel",
        "Perl",
        "Python",
        "R",
        "Ruby",
        "TypeScript",
        "Visual Basic / VBScript"
      ],
      status: [ "Under development", "Implemented" ]
    }
  },
  created() {
    this.getToolsData();
  },
  methods: {
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
      return Math.round(((F1 + F2 + F3) / 3) * 10) * 10
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
        A5 = tool.url_training_materials.score
      }
      return Math.round(((A1 + A2 + A3 + A4 + A5) / 5) * 10) * 10
    },
    calculateI(tool) {

      var I1 = 0
      if (tool.software_proglanguage) {
        var individual_score = []
        for (proglang of tool.software_proglanguage) {
          individual_score.push({
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
            "TypeScript": 1,
            "Visual Basic / VBScript": 0.5,
            "Capsis platform": 1
          }[proglang])
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
      
      return Math.round(((I1 + I2 + I3 + I4 + I5 + I6) / count) * 10) * 10
    },
    calculateR(tool) {
      var R1 = 0
      if (tool.license) {
        R1 = {
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
          "Not stated": 0,
          "Don't know": 0
        }[tool.license]
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

      return Math.round(((R1 + R2 + R3 + R4) / 4) * 10) * 10
    },
    getToolsData() {
      this.tools = this.$root.$data.tools
      this.filteredTools = this.$root.$data.tools
      this.isReady = true
    },
    updateFiltered() {
      var filters = {
        //Stack: this.stack,
        status: this.status,
        software_proglanguage: this.software_proglanguage
      }

      this.filteredTools = Object.filter(this.tools, function(tool) {
        var yesOrNo = true
        for (const [key, value] of Object.entries(filters)) {
            toolValue = tool[key]
            if (toolValue == "") {
              yesOrNo = yesOrNo && false
            } else {
              if (key == "status") {
                yesOrNo = yesOrNo && value.includes(toolValue)
              } else if (key == "software_proglanguage") {
                yesOrNo = yesOrNo && toolValue.some(a => value.includes(a))
              } else {
                yesOrNo = yesOrNo && toolValue.toLowerCase().includes(value.toLowerCase())
              }
            }
        }
        return yesOrNo
      })      
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
  },
  watch: {
    // TODO #4 review filters
    stack(newValue, oldValue) {
      this.updateFiltered();
    },
    status: {
      handler: function(newValue, oldValue) { this.updateFiltered(); },
      deep: true
    },
    software_proglanguage: {
      handler: function(newValue, oldValue) { this.updateFiltered(); },
      deep: true
    },
    license(newValue, oldValue) {
      this.updateFiltered();
    },
  },
}
</script>

<template>
  <div v-if="isReady">
    <div class="note text-center mb-2">
      <p>This tool is in constant change. The previous version, and old database, is still available  <a target="_blank" href="https://mvarc.eu/tools/dev/digitaf_tools/">here</a>.</p>
    </div>
    <div class="row no-gutters">
      <div class="col-3 filters no-gutters">
        <div class="col-12 mb-2 text-center">
          <a class="btn btn-digitaf mt-2" href="https://forms.gle/cKwFUzGuckhfSHum6" role="button"><b>Add a new tool</b></a>
        </div>
        <div class="col-12 mb-2 row">
          <!--p class="mb-1"><b>Purpose</b></p>
          <select class="form-control" v-model="license">
            <option value=null>-</option>
            <option value=Apache>Apache</option>
            <option value=GPLv2>GPLv2</option>
            <option value=GPLv3>GPLv3</option>
            <option value=MIT>MIT</option>
          </select-->
          <p class="col-12 mb-1"><b>Status</b></p>
          <div class="col-12"><input type="checkbox" id="dev" value="Under development" v-model="status">
          <label for="dev">Under development</label></div>
          <div class="col-12"><input type="checkbox" id="prod" value="Implemented" v-model="status">
          <label for="prod">Implemented</label></div>
        </div>
        <div class="col-12 mb-2 row">
          <p class="col-12 mb-1"><b>Software/Programming language</b></p>
          <div class="col-12"><input type="checkbox" id="c" value="C" v-model="software_proglanguage">
          <label for="c">C</label></div>
          <div class="col-12"><input type="checkbox" id="cplus" value="C++" v-model="software_proglanguage">
          <label for="cplus">C++</label></div>
          <div class="col-12"><input type="checkbox" id="cplus" value="C#" v-model="software_proglanguage">
          <label for="csharp">C#</label></div>
          <div class="col-12"><input type="checkbox" id="fortran" value="Fortran" v-model="software_proglanguage">
          <label for="fortran">Fortran</label></div>
          <div class="col-12"><input type="checkbox" id="java" value="Java" v-model="software_proglanguage">
          <label for="java">Java</label></div>
          <div class="col-12"><input type="checkbox" id="javascript" value="Javascript" v-model="software_proglanguage">
          <label for="javascript">Javascript</label></div>
          <div class="col-12"><input type="checkbox" id="julia" value="Julia" v-model="software_proglanguage">
          <label for="julia">Julia</label></div>
          <div class="col-12"><input type="checkbox" id="matlab" value="Matlab" v-model="software_proglanguage">
          <label for="matlab">Matlab</label></div>
          <div class="col-12"><input type="checkbox" id="excel" value="Microsoft Excel" v-model="software_proglanguage">
          <label for="excel">Microsoft Excel</label></div>
          <div class="col-12"><input type="checkbox" id="perl" value="Perl" v-model="software_proglanguage">
          <label for="perl">Perl</label></div>
          <div class="col-12"><input type="checkbox" id="python" value="Python" v-model="software_proglanguage">
          <label for="python">Python</label></div>
          <div class="col-12"><input type="checkbox" id="r" value="R" v-model="software_proglanguage">
          <label for="r">R</label></div>
          <div class="col-12"><input type="checkbox" id="ruby" value="Ruby" v-model="software_proglanguage">
          <label for="ruby">Ruby</label></div>
          <div class="col-12"><input type="checkbox" id="typescript" value="TypeScript" v-model="software_proglanguage">
          <label for="typescript">TypeScript</label></div>
          <div class="col-12"><input type="checkbox" id="vb" value="Visual Basic / VBScript" v-model="software_proglanguage">
          <label for="vb">Visual Basic / VBScript</label></div>
        </div>
      </div>
      <div class="col-9 row">
        <div class="col-sm-6 mb-4" v-for="tool in filteredTools" :key="tool.id">
          <div class="card tool box h-100">
            <!--div class="card-header text-center" id="headingOne" data-toggle="collapse" data-target="#collapseOne">
              <p class="mb-0"><b><a v-if="tool.Link" :href="tool.Link" target="_blank">{{ tool.Tool }}</a><span v-else>{{ tool.Tool }}</span></b></p>
            </div-->
            <img class="card-img-top" :src="imageLink(tool)" :alt="tool.name">
            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
              <div class="card-body row">
                <div class="col-12"><h5 class="card-title text-center"><b>{{ tool.name }}</b></h5></div><!--router-link :to="tool.id">{{ tool.name }}</router-link-->
                <div class="col-9 text-center"><p class="card-text">{{tool.description_brief}}</p></div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>