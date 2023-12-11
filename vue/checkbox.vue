<script>
module.exports = {
  name: "checkbox",
  props: [ 'filter', 'search' ],
	data() {
		return {
		}
	},
	computed: {
		value: {
			get() {
				return this.search[this.filter.id]
			},
			set(newValue) {
				this.$set(this.search, this.filter.id, newValue)
				VueBus.$emit('updateFilteredTools')
			}
		}
	},
	methods: {
		removeOther(arr) {
			if (arr[arr.length-1] == "Other...") {
				return arr.pop()
			} else {
				return arr
			}
		}
	}
}
</script>

<template>
	<div>
		<div class="form-check" v-for="(answer, index) in removeOther(filter.answers)" :key="index">
			<input class="form-check-input" type="checkbox"
				:value ="answer"
				v-model="value">
			<label class="form-check-label">{{ answer }}</label>
		</div>
	</div>
</template>