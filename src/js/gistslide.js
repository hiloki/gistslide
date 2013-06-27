(function() {

    var win = window;
    var doc = win.document;

    function createNode(tagName, param) {
        var node = doc.createElement(tagName);
        var key;
        for(key in param) {
            node.setAttribute(key, param[key]);
        }
        return node;
    }

    var headerPosition = [];
    var currentSlideIndex = 0;
    function calcCurrentIndex() {}

    function keydownEventHandler(e) {
        if(e.which == 37) {
            currentSlideIndex = calcCurrentIndex();
            slideTo(--currentSlideIndex);
        } else if(e.which == 39) {
            currentSlideIndex = calcCurrentIndex();
            slideTo(++currentSlideIndex);
        }
    }

    function slideTo(index) {
        var position = (headerPosition.length < index) ? 0 : headerPosition[index];
        window.scrollTo(position);
    }

    (function() {
        //create link node
        var css = createNode("link", {
            rel: "stylesheet",
            href: "https://raw.github.com/1000ch/gistdeck/master/src/css/gistslide.css"
        });

        //insert nodes into head tail
        doc.querySelector("head").appendChild(js);

        var headerArray = [].concat(doc.getElementsByTagName("h1")).concat(doc.getElementsByTagName("h2"));
        for(var i = 0, len = headerArray.length;i < len;i++) {
            console.log(headerArray[i].scrollTop);
        }

        //listen keydown event
        doc.addEventListener("keydown", keydownEventHandler);
    })();

})();