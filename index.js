
(function() {
	// global object
	const changeIcon = {
		actions : [],
		onAnotherTab: function(title,icon) {
			if(!title || !icon) return;
			window.addEventListener("blur", () => {
				opt.mainTitle.innerText = title;
				addNewFavicons(icon);
			});
		},
		onThisTab: function(cb) {
			window.addEventListener("focus", () => {
				if(!cb) return emitAction("original");
				cb();
			});
		},
		addAction: addAction,
		emitAction: emitAction
	};
	// private options
	const opt = {};
	// private functions
	function getInitialOpt() {
		// get title
		const mainTitle = document.getElementsByTagName("title")[0];
		// get favicon in all links [ rel = icon ]
		const links = document.getElementsByTagName("link");

		const mainFavicons = [];
		// loop the links to find icon
		for(let i = 0; i < links.length; i++) {
			if(links[i].rel === "icon") mainFavicons.push(links[i]);
		}
		// add standart action for turning to original

		addAction("original",mainTitle.innerText,mainFavicons[0].href);

		// when user changes the tabs
		opt.mainTitle = mainTitle;
		opt.favicons = mainFavicons;
	}
	getInitialOpt();
	
	function addNewFavicons(icon) {
		//-> Changing the favicons source (href) is unsiffcent
		//-> I have to remove all of them and create new ones
		const head = document.getElementsByTagName("head")[0];

		for(let i = 0; i < head.children.length; i++) {
			const child = head.children[i];
			if(child.rel && child.rel === "icon") {
				head.removeChild(child);
			}
		}
		//-> Old ones have removed
		for(let i = 0; i < opt.favicons.length; i++) {
			const favicon = opt.favicons[i];
			favicon.href = icon
			head.appendChild(favicon);
		}
	}
	
	function addAction(name,title,icon) {
		if(!name || !title || !icon) return "provide values";
		// check for other actions with same name
		if(changeIcon.actions.find(action => action.name === name)) return name + " was used before";

		// push the new action
		changeIcon.actions.push({
			name,
			title,
			icon
		});
	}

	function emitAction(name) {
		// find the action with given name
		const action = changeIcon.actions.find(action => {
			return name === action.name;
		});
		// return if not found
		if(!action) return name + " was not found";
		// setup options
		opt.mainTitle.innerText = action.title;
		// delete all existing favicons and and new ones
		addNewFavicons(action.icon);
	}

	window.changeIcon = changeIcon;
})();