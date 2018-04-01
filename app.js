golos.config.set('websocket', 'wss://ws.testnet.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

localStorage && localStorage.wif ? window.wif = localStorage.wif : window.wif = '';
localStorage && localStorage.username ? window.username = localStorage.username : window.username = '';

let callbackAuth;
let auth = function(callback) {
	if (wif && username) callback();
	else {
		app.loginDialog = true;
		callbackAuth = callback;
	}
};

var app = new Vue({
		el: '#app',
		data: {
			page: 'about',
			registered: false,
			loginDialog: false,
			registerdialog: false,
			newResourceDialog: false,
			projlist: [],
			resourceList: [],
			
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
			password: '',
			title: '',
			description: '',
			howGet: '',
			contacts: '',
			combs: '',
		},
		
		methods: {
			showprojects: function(event){
				this.page = 'projects';
				console.log('переход на проекты');
				
			},
			showResources: function(event){
				this.page = 'resources';
				app.resourceList = [];
				var query = {
					select_tags: ['beesocial'],
					limit: 100,
				};
				golos.api.getDiscussionsByCreated(query, function(err, result) {
					//console.log(err, result);
					if ( ! err) {
						result.forEach(function(item) {
							let jsonMetadata = JSON.parse(item.json_metadata);
							app.resourceList.push({
								title: jsonMetadata.title,
								description: jsonMetadata.description,
							});
						});
					}
					else console.error(err);
				});
			},
			submit: function(event) {
				if (app.loginDialog) {
					const roles = ['posting'];
					let keys = golos.auth.getPrivateKeys(this.login, this.password, roles);
					golos.api.getAccounts([this.login], function(err, response) {
						if (response && response[0] && response[0].posting.key_auths[0][0] == keys.postingPubkey) {
							wif = keys.posting;
							localStorage.wif = wif;
							let resultWifToPublic = golos.auth.wifToPublic(wif);
							let result = golos.api.getKeyReferences([resultWifToPublic], function(err, result) {
								if (result && result[0]) {
									username = result[0][0];
									localStorage.username = username;
									app.loginDialog = false;
									if (callbackAuth) callbackAuth();
								} else if (err) console.error(err);
							});
						} else alert('Неверный логин или пароль!');
					});
				}
				else if (app.newResourceDialog) {
					let parentAuthor = '';
					let parentPermlink = 'beesocial';
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
					auth(function() {
						golos.broadcast.comment(wif, parentAuthor, parentPermlink, username, permlink, title, body, jsonMetadata, function (err, result) {
							//console.log(err, result);
							if ( ! err) {
								//console.log('post: ', result);
								//window.location.hash = username + '/' + str;
								app.newResourceDialog = false;
							} else console.error(err);
						});
					});
				}
			}
		},
});