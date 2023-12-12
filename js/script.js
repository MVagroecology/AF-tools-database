httpVueLoader.register(Vue, 'vue/filtering.vue');
httpVueLoader.register(Vue, 'vue/checkbox.vue');
httpVueLoader.register(Vue, 'vue/sorting.vue');

Object.filter = function(obj, predicate) {
	let result = {}, key;

	for (key in obj) {
			if (obj.hasOwnProperty(key) && predicate(obj[key])) {
					result[key] = obj[key];
			}
	}
	
	return result;
};

const router = new VueRouter({
	mode: 'history',
	base: '/tools/dev/AF-tools-database',
	routes: [
		{ path: '/', name: 'homepage',	component: httpVueLoader('vue/contents.vue') },
		{ path: '/:id', name: 'toolpage',	component: httpVueLoader('vue/toolpage.vue') },
		{ path: '*', name: 'notfound',	component: httpVueLoader('vue/notfound.vue') },
	],
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
})

var VueBus = new Vue();

var app = '';

app = new Vue({
	el: '#app',
	router: router,
	data: {
	},
});

function filterObject(obj, callback) {
  return Object.fromEntries(Object.entries(obj).
    filter(([key, val]) => callback(val, key)));
}