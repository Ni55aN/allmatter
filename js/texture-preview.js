var TexturePreview = function (el) {

	var _this = this;
	var size = 100;
	var x = y = 0;
	var mouse = null;
	this.bindElement = null;

	el.addEventListener('wheel', function (e) {
		var d = 0.2 * Math.sign(e.wheelDelta)
		size *= 1 + d;
		resize();
	});

	el.addEventListener('mousedown', function (e) {
		mouse = [e.clientX, e.clientY];
	});

	window.addEventListener('mousemove', function (e) {
		if (!mouse) return;
		e.preventDefault();
		x += e.clientX - mouse[0];
		y += e.clientY - mouse[1];

		mouse = [e.clientX, e.clientY];
		_this.update();
	});

	window.addEventListener('mouseup', function () {
		mouse = null
	});


	this.bind = function (el) {
		this.bindElement = el;
		this.update();
	}

	this.update = function () {
		if (!this.bindElement) return;
		el.style.backgroundImage = "url('" + this.bindElement.src + "')";
		this.resize();
	}

	var resize = this.resize = function () {
		if (el.clientWidth > el.clientHeight)
			el.style.backgroundSize = 'auto ' + size + '%';
		else
			el.style.backgroundSize = size + '% auto';

		el.style.backgroundPosition = x + 'px ' + y + 'px';

	}

	window.addEventListener('resize', this.resize);

	this.resize();
}