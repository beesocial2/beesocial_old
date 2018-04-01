golos.config.set('websocket', 'wss://ws.testnet.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

localStorage && localStorage.wif ? window.wif = JSON.parse(localStorage.wif) : window.wif = {};
localStorage && localStorage.username ? window.username = localStorage.username : window.username = '';

let callbackAuth;
let auth = function(callback) {
	if (wif && username) callback();
	else {
		app.loginDialog = true;
		callbackAuth = callback;
	}
};

let $loader = document.getElementsByClassName('lding')[0];
let loadingShow = function() {
	$loader.style.display = 'block';
};
let loadingHide = function() {
	$loader.style.display = 'none';
};

let mainTag = 'beesocial';

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
			resourceDialog: false,
			resourceDetail: {},
			
			hasWif: username,
			
			combs: localStorage && localStorage.combs ? localStorage.combs : '',

			transfersHeaders: [
				{ text: 'Дата и время приобритения', value: 'time' },
				{ text: 'Название', value: 'title' },
				{ text: 'Спонсор', value: 'author' },
				{ text: 'Соты', value: 'combs' },
				{ text: 'Как получить', value: 'howGet' },
				{ text: 'Контакты', value: 'contacts' },
				{ text: 'Описание', value: 'description' }
			],
			transfersData: [],
			
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
					select_tags: [mainTag],
					limit: 100,
				};
				loadingShow();
				golos.api.getDiscussionsByCreated(query, function(err, result) {
					loadingHide();
					//console.log(err, result);
					if ( ! err) {
						result.forEach(function(item) {
							let jsonMetadata = JSON.parse(item.json_metadata);
							app.resourceList.push({
								author: item.author,
								permlink: item.permlink,
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
					loadingShow();
					const roles = ['posting', 'active'];
					wif = golos.auth.getPrivateKeys(this.login, this.password, roles);
					golos.api.getAccounts([this.login], function(err, response) {
						loadingHide();
						if (response && response[0] && response[0].posting.key_auths[0][0] == wif.postingPubkey) {
							localStorage.wif = JSON.stringify(wif);
							loadingShow();
							let resultWifToPublic = golos.auth.wifToPublic(wif['posting']);
							let result = golos.api.getKeyReferences([resultWifToPublic], function(err, result) {
								loadingHide();
								if (result && result[0]) {
									username = result[0][0];
									localStorage.username = username;
									app.loginDialog = false;
									app.hasWif = true;
									app.combs = response[0].balance.substring(0, response[0].balance.length - 10);
									localStorage.combs = app.combs;
									if (callbackAuth) callbackAuth();
								} else if (err) console.error(err);
							});
						} else alert('Неверный логин или пароль!');
					});
				}
				else if (app.newResourceDialog) {
					let parentAuthor = '';
					let parentPermlink = mainTag;
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
						loadingShow();
						golos.broadcast.comment(wif['posting'], parentAuthor, parentPermlink, username, permlink, title, body, jsonMetadata, function (err, result) {
							loadingHide();
							//console.log(err, result);
							if ( ! err) {
								//console.log('post: ', result);
								//window.location.hash = username + '/' + str;
								app.newResourceDialog = false;
								app.showResources();
							} else console.error(err);
						});
					});
				}
			},
			getResourceDetail: function(author, permlink) {
				loadingShow();
				golos.api.getContent(author, permlink, function(err, item) {
					loadingHide();
					//console.log(err, item);
					if ( ! err) {
						let jsonMetadata = JSON.parse(item.json_metadata);
						app.resourceDetail = {
							author: item.author,
							permlink: item.permlink,
							title: jsonMetadata.title,
							description: jsonMetadata.description,
							howGet: jsonMetadata.howGet,
							contacts: jsonMetadata.contacts,
							combs: jsonMetadata.combs,
						};
						app.resourceDialog = true;
					}
					else console.error(err);
				});
			},
			transfer: function() {
				auth(function() {
					loadingShow();
					golos.broadcast.transfer(wif['active'], username, app.resourceDetail.author, `${app.resourceDetail.combs}.000 GOLOS`, JSON.stringify(app.resourceDetail), function(err, result) {
						loadingHide();
						//console.log(err, result);
						if ( ! err) {
							//console.log('transfer', result);
							app.resourceDialog = false;
							swal({title: 'Вы купили этот ресурс!',type: 'success' });
							localStorage.combs = localStorage.combs - app.resourceDetail.combs;
							app.combs = app.combs - app.resourceDetail.combs;
						}
						else console.error(err);
					});
				});
			},
			showTransfers: function(event){
				this.page = 'transfers';
				auth(function() {
					loadingShow();
					golos.api.getAccountHistory(username, -1, 99, function(err, transactions) {
						loadingHide();
						if (transactions.length > 0) {
							transactions.reverse();
							let operationsCount = 0;
							transactions.forEach(function(transaction) {
								if (transaction[1].op[0] == 'transfer' && transaction[1].op[1].memo) {
									let metaData = JSON.parse(transaction[1].op[1].memo);
									if (metaData && metaData.combs) {
										operationsCount++;
										app.transfersData.push({
											value: false,
											time: transaction[1].timestamp,
											title: metaData.title,
											author: metaData.author,
											combs: metaData.combs,
											howGet: metaData.howGet,
											contacts: metaData.contacts,
											description: metaData.description
										});
									}
								}
							});
							if (operationsCount == 0) swal({title: 'Error', type: 'error', text: `Вы пока что не приобритали ресурсов!`});
						}
						else {
							swal({title: 'Error', type: 'error', text: err});
						}
					});
				});
			},
			showLogin: function() {
				app.loginDialog = true;
			},
			logout: function() {
				wif = null;
				username = null;
				delete localStorage.wif;
				delete localStorage.username;
				app.hasWif = false;
			}
		},
});