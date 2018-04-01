golos.config.set('websocket', 'wss://ws.testnet.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

localStorage && localStorage.wif ? window.wif = localStorage.wif : window.wif = '';
localStorage && localStorage.username ? window.username = localStorage.username : window.username = '';

var app = new Vue({
		el: '#app',
		data: {
			page: 'about',
			registered: false,
			registerdialog: false,
			newResourceDialog: false,
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
			title: '',
			description: '',
			howGet: '',
			contacts: '',
			combs: '',
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
				let parentAuthor = '';
				let parentPermlink = 'test';
				let permlink = Date.now().toString();
				let title = this.title;
				let body = '<h1><a href="">Этот пост был создан на платформе BeeSocial</a></h1>' + this.description;
				let jsonMetadata = {
					title: this.title,
					description: this.description,
					howGet: this.howGet,
					contacts: this.contacts,
					combs: this.combs
				};
				golos.broadcast.comment(wif, parentAuthor, parentPermlink, username, permlink, title, body, jsonMetadata, function (err, result) {
					//console.log(err, result);
					if ( ! err) {
						//console.log('post: ', result);
						//window.location.hash = username + '/' + str;
						this.newResourceDialog = false;
					} else console.error(err);
				});
			}
		},
});