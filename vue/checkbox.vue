<script>
module.exports = {
  name: "checkbox",
  props: [ 'filter', 'search', 'tools' ],
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
		},
		cleanedAnwers() {
			return this.removeOther(this.filter.answers)
		}
	},
	methods: {
		removeOther(arr) {
			if (arr[arr.length-1] == "Other...") {
				return this.orderByFrequency(arr.slice(0, -1))
			} else {
				return this.orderByFrequency(arr)
			}
		},
		orderByFrequency(arr) {
			return arr.sort((a, b) => this.numberAvailable(a) > this.numberAvailable(b) ? -1 : 1)
		},
		numberAvailable(answer) {
			return this.tools.filter(tool => tool[this.filter.id] == answer).length
		}
	}
}
</script>

<template>
	<div>
		<div class="form-check" v-for="(answer, index) in cleanedAnwers" :key="index">
			<input class="form-check-input" type="checkbox" :disabled="numberAvailable(answer) == 0"
				:value ="answer"
				v-model="value">
			<label class="form-check-label">{{ answer }} ({{ numberAvailable(answer) }})</label>
		</div>
	</div>
</template>