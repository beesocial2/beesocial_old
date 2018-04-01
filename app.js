var app = new Vue({
		el: '#app',
		data: {
			page: 'about',
			registered: false,
			registerdialog: false,
			projlist: [],
			
			valid: false,
			
			select: null,
			items: [
				'НКО',
				'Спонсор',
				'Волонтёр'
			],
			email: '',
			emailRules: [
				v => !!v || 'Эл.почта необходимо ввести',
				v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Эл.почта необходимо ввести'
			],
			login: '',
			loginRules: [
				v => !!v || 'Логин необходимо ввести',
				v => (v && v.length <= 5) || 'Name must be less than 5 characters'
			],
			password: '',
			passwordRules: [
				v => !!v || 'Пароль необходимо ввести',
				v => (v && v.length <= 5) || 'Name must be less than 5 characters'
			],
		},
		
		methods: {
			showprojects: function (event){
				this.page = 'projects';
				console.log('переход на проекты');
				
			},
			showresources: function (event){
				this.page = 'resources';
				console.log('переход на ресурсы');
				
			},
			submit: function (event) {
				
			}
		},
});