
var app = new Vue({
		el: '#app',
		data: {
			page:"about",
			registered:false,
			registerdialog:false,
			projlist:[],
			
			valid: false,
			
			name: '',
			nameRules: [
				v => !!v || 'Имя и фамилию необходимо ввести',
				v => (v && v.length <= 10) || 'Name must be less than 10 characters'
			],
			email: '',
			emailRules: [
				v => !!v || 'Эл.почта необходимо ввести',
				v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Эл.почта необходимо ввести'
			],
			select: null,
			items: [
				'Item 1',
				'Item 2',
				'Item 3',
				'Item 4'
			],
			checkbox: false,
		},
		
		methods: {
			showprojects: function (event){
				this.page="projects";
				console.log('переход на проекты');
				
			},
			showresources: function (event){
				this.page="resources";
				console.log('переход на ресурсы');
				
			},
			submit: function (event) {
				
			},
			clear:function (event) {
				valid=false;
				this.$refs.form.reset()
			}
		},
});