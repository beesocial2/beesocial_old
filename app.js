// golos.config.set('websocket', 'wss://ws.testnet.golos.io');
// golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

localStorage && localStorage.wif ? window.wif = JSON.parse(localStorage.wif) : window.wif = {};
localStorage && localStorage.username ? window.username = localStorage.username : window.username = '';
// combs: localStorage && localStorage.balance ? localStorage.balance : '',

let $mainPage = document.querySelector('#main-page');
let $purchasedResourcesPage = document.querySelector('#purchased-resources-page');
let $purchasedResourcesTbody = document.querySelector('#purchased-resources tbody');
let $resourcesPage = document.querySelector('#resources-page');
let $resources = $resourcesPage.querySelector('#resources');
let $projectsPage = document.querySelector('#projects-page');
let $projects = $projectsPage.querySelector('#projects');
let $projectModal = document.getElementById('project-modal');
let projectModal = new Modal($projectModal);
let modalAuth = new Modal(document.getElementById('auth'));
let $createResourceModal = document.getElementById('create-resource-modal');
let createResourceModal = new Modal($createResourceModal);
let $resourceModal = document.getElementById('resource-modal');
let resourceModal = new Modal($resourceModal);
let $createProjectModal = document.getElementById('create-project-modal');
let createProjectModal = new Modal($createProjectModal);
let balance = 0;
let $balance = document.querySelector('#balance');
let $login = document.getElementById('login');
let $logout = document.getElementById('logout');
let $resourceItem = document.querySelector('#resource-item');
let resourceItemSelected;
let callbackAuth;
let $loader = document.getElementsByClassName('lding')[0];
let loadingShow = function() {
	$loader.style.display = 'block';
};
let loadingHide = function() {
	$loader.style.display = 'none';
};

let mainTag = 'beesocial';

document.getElementById('form-login-pass').addEventListener('submit', async(e) => {
	e.preventDefault();
	let log = document.getElementById('logged').checked,
		user = document.getElementById('input-user').value,
		pass = document.getElementById('input-pass').value;
	let response = await golos.api.getAccounts([user]);
	if (response[0]) {
		const roles = ['posting', 'active'];
		let keys = await golos.auth.getPrivateKeys(user, pass, roles);
		if (response[0].posting.key_auths[0][0] == keys.postingPubkey) {
			username = user;
			wif = keys;
			$balance.innerHTML = parseInt(response[0].balance) + ' Combs';
			log ? localStorage.username = username : '';
			log ? localStorage.wif = JSON.stringify(wif) : {};
			log ? localStorage.balance = parseInt(response[0].balance) : '';
			$login.style.display = 'none';
			$logout.style.display = 'inline-block';
			modalAuth.hide();
			if (callbackAuth) callbackAuth();
		}
		else {
			swal({
				type: 'error',
				title: 'Error!',
				text: 'Password incorrect'
			});
		}
	}
	else {
		swal({
			type: 'error',
			title: 'Error!',
			text: 'Username incorrect'
		});
	}
});

let arr = document.querySelector('#projects').querySelectorAll('.btn');
arr.forEach(function(item, i, arr) {
  arr[i].addEventListener('click', function() {
	projectModal.show(); // projects modals
	});
});

let auth = function(callback) {
	if (wif && username) callback();
	else {
		modalAuth.show();
		callbackAuth = callback;
	}
};

$login.addEventListener('click', function() {
	modalAuth.show();
});

$logout.addEventListener('click', function() {
	delete localStorage.wif;
	delete localStorage.username;
	delete localStorage.balance;
	window.username = '';
	window.wif = {};
	window.balance = 0;
	$balance.innerHTML = '';
	$logout.style.display = 'none';
	$login.style.display = 'inline-block';
	swal({
		position: 'top-end',
		type: 'success',
		title: 'You are logged out',
		showConfirmButton: false,
		toast: true,
		timer: 1500
	});
});

document.getElementById('create-resource-btn').addEventListener('click', function() {
	createResourceModal.show();
});

let $createResourceModalForm = $createResourceModal.querySelector('form');
$createResourceModalForm.addEventListener('submit', function(e) {
	e.preventDefault();
	let parentAuthor = '';
	let parentPermlink = mainTag;
	let title = this.title.value;
	let permlink = urlLit(title, 0);
	//let body = '<h1><a href="">Этот пост был создан на платформе BeeSocial</a></h1>' + this.description;
	let body = `<h2>Title: ${title}</h2><h2>Description: ${this.description.value}</h2><h2>How get: ${this.howGet.value}</h2><h2>Contacts: ${this.contacts.value}</h2><h2>Combs: ${this.combs.value}</h2>`;
	let jsonMetadata = {
		app: 'beesocial/0.1',
		canonical: 'https://beesocial.in/#resources/' + permlink,
		app_account: 'beesocial',
		data: {
			title: title,
			description: this.description.value,
			howGet: this.howGet.value,
			contacts: this.contacts.value,
			combs: this.combs.value,
			author: username,
			permlink: permlink
		},
		tags: ['resources']
	};
	auth(function() {
		loadingShow();
		golos.broadcast.comment(wif['posting'], parentAuthor, parentPermlink, username, permlink, title, body, jsonMetadata, function (err, result) {
			loadingHide();
			if ( ! err) {
				$createResourceModalForm.reset();
				createResourceModal.hide();
				window.location.hash = '#resources/' + permlink;
			} else console.error(err);
		});
	});
});

document.getElementById('create-project-btn').addEventListener('click', function() {
	createProjectModal.show();
});

let $createProjectModalForm = $createProjectModal.querySelector('form');
$createProjectModalForm.addEventListener('submit', function(e) {
	e.preventDefault();
	let parentAuthor = '';
	let parentPermlink = mainTag;
	let title = this.title.value;
	let permlink = urlLit(title, 0);
	//let body = '<h1><a href="">Этот пост был создан на платформе BeeSocial</a></h1>' + this.description;
	let body = `<h2>Title: ${title}</h2><h2>Description: ${this.description.value}</h2><h2>How get: ${this.howGet.value}</h2><h2>Contacts: ${this.contacts.value}</h2><h2>Combs: ${this.combs.value}</h2>`;
	let jsonMetadata = {
		app: 'beesocial/0.1',
		canonical: 'https://beesocial.in/#resources/' + permlink,
		app_account: 'beesocial',
		data: {
			title: title,
			description: this.description.value,
			howGet: this.howGet.value,
			contacts: this.contacts.value,
			combs: this.combs.value,
			author: username,
			permlink: permlink
		},
		tags: ['resources']
	};
	auth(function() {
		loadingShow();
		golos.broadcast.comment(wif['posting'], parentAuthor, parentPermlink, username, permlink, title, body, jsonMetadata, function (err, result) {
			loadingHide();
			if ( ! err) {
				$createResourceModalForm.reset();
				createResourceModal.hide();
				window.location.hash = '#resources/' + permlink;
			} else console.error(err);
		});
	});
});

if (localStorage.wif) {
	balance = parseInt(localStorage.balance);
	$balance.innerHTML = balance + ' Combs';
	$login.style.display = 'none';
	$logout.style.display = 'inline-block';
	username = localStorage.username;
}

let getResources = function() {
	loadingShow();
	$resources.innerHTML = '';
	var query = {
		select_tags: [mainTag],
		limit: 100,
	};
	golos.api.getDiscussionsByCreated(query, function(err, result) {
		loadingHide();
		//console.log(err, result);
		if ( ! err) {
			result.forEach(function(item) {
				item.jsonMetadata = JSON.parse(item.json_metadata);
				if (item.jsonMetadata.app == 'beesocial/0.1') {
					console.log(item);
					let $newItem = $resourceItem.cloneNode(true);
					$newItem.querySelector('.card-title').innerHTML = item.jsonMetadata.data.title;
					$newItem.querySelector('.card-text').innerHTML = item.jsonMetadata.data.description;
					$newItem.setAttribute('data-author', item.author);
					$newItem.setAttribute('data-permlink', item.permlink);
					$newItem.querySelector('button').addEventListener('click', function() {
						//resourceItemSelected = {author: item.author, permlink: item.permlink};
						resourceItemSelected = item;
						$resourceModal.querySelector('#resource-title').innerHTML = item.jsonMetadata.data.title;
						$resourceModal.querySelector('#resource-description').innerHTML = item.jsonMetadata.data.description;
						$resourceModal.querySelector('#resource-how-get').innerHTML = item.jsonMetadata.data.howGet;
						$resourceModal.querySelector('#resource-contacts').innerHTML = item.jsonMetadata.data.contacts;
						$resourceModal.querySelector('#resource-combs').innerHTML = item.jsonMetadata.data.combs;
						resourceModal.show();
					});
					$newItem.style.display = 'block';
					$resources.appendChild($newItem);
				}
			});
		}
		else console.error(err);
	});
};

$resourceModal.querySelector('#buy-resource-btn').addEventListener('click', function() {
	loadingShow();
	auth(function() {
		golos.broadcast.transfer(wif['active'], username, resourceItemSelected.author, `${resourceItemSelected.jsonMetadata.data.combs}.000 GOLOS`, JSON.stringify(resourceItemSelected.jsonMetadata), function(err, result) {
			loadingHide();
			console.log(err, result);
			if ( ! err) {
				resourceModal.hide();
				swal({ title: 'You buyed this resource!', type: 'success' });
				localStorage.balance = localStorage.balance - resourceItemSelected.jsonMetadata.data.combs;
				balance = balance - resourceItemSelected.jsonMetadata.data.combs;
				$balance.innerHTML = balance + ' Combs';
			}
			else {
				swal({ type: 'error', title: err.message });
				console.error(err);
			}
		});
	});
});

document.querySelector('#buy-resource-btn').addEventListener('click', function() {
	projectModal.show();
});

/*let submit = function(event) {
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
};*/

let showPurchasedResources = function(event) {
	$purchasedResourcesTbody.innerHTML = '';
	loadingShow();
	auth(function() {
		golos.api.getAccountHistory(username, -1, 99, function(err, transactions) {
			loadingHide();
			if (transactions.length > 0) {
				transactions.reverse();
				let operationsCount = 0;
				transactions.forEach(function(transaction) {
					if (transaction[1].op[0] == 'transfer' && transaction[1].op[1].memo) {
						let metaData;
						try {
							metaData = JSON.parse(transaction[1].op[1].memo);
						}
						catch (e) {
						}
						if (metaData && metaData.app == 'beesocial/0.1') {
							operationsCount++;
							let $newRow = $purchasedResourcesTbody.insertRow();
							$newRow.innerHTML = `<tr>
													<td>${transaction[1].timestamp}</td>
													<td>${metaData.data.title}</td>
													<td>${metaData.data.author}</td>
													<td>${metaData.data.combs}</td>
													<td>${metaData.data.howGet}</td>
													<td>${metaData.data.contacts}</td>
													<td>${metaData.data.description}</td>
												</tr>`;
						}
					}
				});
				if (operationsCount == 0) swal({title: 'Error', type: 'error', text: 'You have not yet acquired resources!'});
			}
			else {
				swal({title: 'Error', type: 'error', text: err});
			}
		});
	});
};

/*let getResourceDetail = function(author, permlink) {
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
		}
		else console.error(err);
	});
};*/

let urlLit = function(w, v) {
	var tr = 'a b v g d e ["zh","j"] z i y k l m n o p r s t u f h c ch sh ["shh","shch"] ~ y ~ e yu ya ~ ["jo","e"]'.split(' ');
	var ww = '';
	w = w.toLowerCase();
	for (i = 0; i < w.length; ++i) {
		cc = w.charCodeAt(i);
		ch = (cc >= 1072 ? tr[cc - 1072] : w[i]);
		if (ch.length < 3) ww += ch;
		else ww += eval(ch)[v];
	}
	return (ww.replace(/[^a-zA-Z0-9\-]/g, '-').replace(/[-]{2,}/gim, '-').replace(/^\-+/g, '').replace(/\-+$/g, ''));
};

window.addEventListener('hashchange', function() {
	let hash = window.location.hash.substring(1);
	if (hash) {
		let params = hash.split('/');
			console.log(params);
		if (params[0]) {
			switch (params[0]) {
				case 'resources': {
					$mainPage.style.display = 'none';
					$purchasedResourcesPage.style.display = 'none';
					$projectsPage.style.display = 'none';
					$resourcesPage.style.display = 'block';
					getResources();
				}; break;
				case 'projects': {
					$mainPage.style.display = 'none';
					$purchasedResourcesPage.style.display = 'none';
					$resourcesPage.style.display = 'none';
					$projectsPage.style.display = 'block';
				}; break;
				case 'purchased-resources': {
					$mainPage.style.display = 'none';
					$resourcesPage.style.display = 'none';
					$projectsPage.style.display = 'none';
					$purchasedResourcesPage.style.display = 'block';
					showPurchasedResources();
				}; break;
			}
		}
	}
	else {
		$purchasedResourcesPage.style.display = 'none';
		$mainPage.style.display = 'block';
	}
});

document.querySelector('#avatar').addEventListener("focusin", function () {
	document.querySelector('#dropdown-avatar').classList.add('show');
});

document.querySelector('#dropdown-avatar').addEventListener('click', function () {
	document.querySelector('#dropdown-avatar').classList.remove('show');
});

window.dispatchEvent(new CustomEvent('hashchange'));
