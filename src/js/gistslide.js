(function() {

	//cache external variable
	var win = window;
	var doc = win.document;
	var slice = [].slice;
	var map = [].map;

	/**
	 * alias for document.querySelector
	 * @param selector
	 * @returns {Node}
	 */
	var qs = function(selector) {
		return doc.querySelector(selector);
	};

	/**
	 * alias for document.querySelectorAll
	 * @param selector
	 * @returns {NodeList}
	 */
	var qsa = function(selector) {
		return doc.querySelectorAll(selector);
	};

	//constant
	var KEYCODE_LEFT = 37;
	var KEYCODE_UP = 38;
	var KEYCODE_RIGHT = 39;
	var KEYCODE_BOTTOM = 40;

	/**
	 * create node
	 * @param {string} tagName
	 * @param {object} param
	 * @returns {HTMLElement}
	 */
	function createNode(tagName, param) {
		var node = doc.createElement(tagName);
		var key;
		for(key in param) {
			node.setAttribute(key, param[key]);
		}
		return node;
	}

	/**
	 * wrap node
	 * @param {HTMLElement} targetNode
	 * @param {HTMLElement} wrapNode
	 */
	function wrapNode(targetNode, wrapNode) {
		wrapNode.appendChild(targetNode.cloneNode(true));
		var parentNode = targetNode.parentNode;
		parentNode.insertBefore(wrapNode, targetNode);
		parentNode.removeChild(targetNode);
	}

	/**
	 * slide container
	 * @param headerElements
	 * @constructor
	 */
	function SlideContainer(headerElements) {
		this.headerElements = headerElements;
		this.headerElements.sort(function(x, y) {
			return parseInt(x.offsetTop, 10) > parseInt(y.offsetTop);
		});
		this.headerOffsets = map.call(this.headerElements, function(htmlElement) {
			return htmlElement.offsetTop;
		});
		this.limitIndex = this.headerElements.length;
		this.currentIndex = 0;
		/**
		 * slide to index
		 * @param {number} index
		 */
		this.slideTo = function(index) {
			if(index < 0) {
				window.scrollTo(0, 0);
			} else if(this.limitIndex < index) {
				window.scrollTo(0, this.headerOffsets[this.limitIndex]);
			} else {
				window.scrollTo(0, this.headerOffsets[index]);
			}
		};
		/**
		 * slide to prev
		 */
		this.prev = function() {
			this.currentIndex--;
			if(this.currentIndex < 0) {
				this.currentIndex = 0;
			}
			this.slideTo(this.currentIndex);
		};
		/**
		 * slide to prev
		 */
		this.next = function() {
			this.currentIndex++;
			if(this.limitIndex < this.currentIndex) {
				this.currentIndex = this.limitIndex;
			}
			this.slideTo(this.currentIndex);
		};
	}

	function initializeGist() {
		//hide left panel
		qs(".root-pane").style.display = "none";

		//fix main content
		var column = qs(".column");
		column.style.float = "none";
		column.style.width = "100%";

		//hide other content
		qs(".js-comment-form").style.display = "none";
		qs("#header").style.display = "none";
		qs(".pagehead").style.display = "none";
		qs("#footer").style.display = "none";
	}

	(function() {
		//if here is not gist@github
		if(win.location.hostname != 'gist.github.com') {
			return;
		}
		//get hash string
		var cssFile = win.location.hash.replace('#', '');

		//create link node
		var linkNode = createNode('link', {
			rel: 'stylesheet',
			type: 'text/css',
			href: 'https://raw.github.com/1000ch/gistslide/master/src/css/themes/' + cssFile + '.css'
		});

		//insert nodes into head tail
		qs('head').appendChild(linkNode);

		initializeGist();

		//cache header positions
		var header1 = slice.call(qsa('h1'));
		var header2 = slice.call(qsa('h2'));
		var container = new SlideContainer(header1.concat(header2));
		container.headerElements.forEach(function(element) {
			wrapNode(element, createNode("div", {
				class: "sampleClass"
			}));
		});

		//listen keydown event
		doc.addEventListener('keydown', function(e) {
			if(e.keyCode == KEYCODE_LEFT) {
				container.prev();
			} else if(e.keyCode == KEYCODE_RIGHT) {
				container.next();
			}
		});
	})();

})();
