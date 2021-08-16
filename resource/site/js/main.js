'use strict';
/**
 * Full page
 */
 (function () {
	/**
	 * Full scroll main function
	 */
	let fullScroll = function (params) {
		/**
		 * Main div
		 * @type {Object}
		 */
		const main = document.querySelector('main');

		/**
		 * Sections div
		 * @type {Array}
		 */
		const sections = main.querySelectorAll('section');

		/**
		 * Full page scroll configurations
		 * @type {Object}
		 */
		const defaults = {
			container : main,
			sections : sections,
			animateTime : params.animateTime || 0.7,
			animateFunction : params.animateFunction || 'ease',
			maxPosition: sections.length - 1,
			currentPosition: 0,
			displayDots: typeof params.displayDots != 'undefined' ? params.displayDots : true,
			dotsPosition: params.dotsPosition || 'left'
		};

		this.defaults = defaults;
		/**
		 * Init build
		 */
		this.init();
	};

	/**
	 * Init plugin
	 */
	fullScroll.prototype.init = function () {
		this.buildSections()
			.buildDots()
			.buildPublicFunctions()
			.addEvents();

		let anchor = location.hash.replace('#', '').split('/')[0];
		location.hash = 0;
		this.changeCurrentPosition(anchor);
	};

	/**
	 * Build sections
	 * @return {Object} this(fullScroll)
	 */
	fullScroll.prototype.buildSections = function () {
		let sections = this.defaults.sections;
		for (let i = 0; i < sections.length; i++) {
			sections[i].setAttribute('data-index', i);
		}
		return this;
	};

	/**
	 * Build dots navigation
	 * @return {Object} this (fullScroll)
	 */
	fullScroll.prototype.buildDots = function () {
		this.ul = document.createElement('ul');
		this.ul.classList.add('dots');
		this.ul.classList.add(this.defaults.dotsPosition == 'right' ? 'dots-right' : 'dots-left');
		let _self = this;
		let sections = this.defaults.sections;

		for (let i = 0; i < sections.length; i++) {
			let li = document.createElement('li');
			let a = document.createElement('a');

			a.setAttribute('href', '#' + i);
			li.appendChild(a);
			_self.ul.appendChild(li);
		}

		this.ul.childNodes[0].firstChild.classList.add('active');

		if (this.defaults.displayDots) {
			document.body.appendChild(this.ul);
		}

		return this;
	};

	/**
	 * Add Events
	 * @return {Object} this(fullScroll)
	 */
	fullScroll.prototype.addEvents = function () {

		if (document.addEventListener) {
			document.addEventListener('mousewheel', this.mouseWheelAndKey, false);
			document.addEventListener('wheel', this.mouseWheelAndKey, false);
			document.addEventListener('keyup', this.mouseWheelAndKey, false);
			document.addEventListener('touchstart', this.touchStart, false);
			document.addEventListener('touchend', this.touchEnd, false);
			document.addEventListener('click', this.click, false);
			window.addEventListener("hashchange", this.hashChange, false);

			/**
			 * Enable scroll if decive don't have touch support
			 */
			if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				if(!('ontouchstart' in window)){
					document.body.style = "overflow: scroll;";
					document.documentElement.style = "overflow: scroll;";
				}
			}

		} else {
			document.attachEvent('onmousewheel', this.mouseWheelAndKey, false);
			document.attachEvent('onkeyup', this.mouseWheelAndKey, false);
		}

		return this;
	};

	/**
	 * Build public functions
	 * @return {[type]} [description]
	 */
	fullScroll.prototype.buildPublicFunctions = function () {
		let mTouchStart = 0;
		let mTouchEnd = 0;
		let _self = this;
		document.querySelector('footer .bottom .scroll').addEventListener('click', () => {
			_self.defaults.currentPosition ++;
			_self.changeCurrentPosition(_self.defaults.currentPosition);
		});
		this.mouseWheelAndKey = function (event) {
			if (event.deltaY > 0 || event.keyCode == 40) {
				_self.defaults.currentPosition ++;
				_self.changeCurrentPosition(_self.defaults.currentPosition);
			} else if (event.deltaY < 0 || event.keyCode == 38) {
				_self.defaults.currentPosition --;
				_self.changeCurrentPosition(_self.defaults.currentPosition);
			}
			_self.removeEvents();
		};

		this.touchStart = function (event) {
			mTouchStart = parseInt(event.changedTouches[0].clientY);
			mTouchEnd = 0;
		};
		this.touchEnd = function (event) {
			mTouchEnd = parseInt(event.changedTouches[0].clientY);
			if (mTouchEnd - mTouchStart > 100 || mTouchStart - mTouchEnd > 100) {
				if (mTouchEnd > mTouchStart) {
					_self.defaults.currentPosition --;
				} else {
					_self.defaults.currentPosition ++;
				}
				_self.changeCurrentPosition(_self.defaults.currentPosition);
			}
		};

		this.hashChange = function (event) {
			if (location) {
				let anchor = location.hash.replace('#', '').split('/')[0];
				if (anchor !== "") {
					if (anchor < 0) {
						_self.changeCurrentPosition(0);
					} else if (anchor > _self.defaults.maxPosition) {
						_self.changeCurrentPosition(_self.defaults.maxPosition);
					} else {
						_self.defaults.currentPosition = anchor;
						_self.animateScroll();
					}
				}
			}
		};

		this.removeEvents = function () {
			if (document.addEventListener) {
			document.removeEventListener('mousewheel', this.mouseWheelAndKey, false);
			document.removeEventListener('wheel', this.mouseWheelAndKey, false);
			document.removeEventListener('keyup', this.mouseWheelAndKey, false);
			document.removeEventListener('touchstart', this.touchStart, false);
			document.removeEventListener('touchend', this.touchEnd, false);

			} else {
				document.detachEvent('onmousewheel', this.mouseWheelAndKey, false);
				document.detachEvent('onkeyup', this.mouseWheelAndKey, false);
			}

			setTimeout(function(){
				_self.addEvents();
			}, 600);
		};

		this.animateScroll = function () {
			let animateTime = this.defaults.animateTime;
			let animateFunction = this.defaults.animateFunction;
			let position = this.defaults.currentPosition * 100;

			this.defaults.container.style.webkitTransform = 'translateY(-' + position + '%)';
			this.defaults.container.style.mozTransform = 'translateY(-' + position + '%)';
			this.defaults.container.style.msTransform = 'translateY(-' + position + '%)';
			this.defaults.container.style.transform = 'translateY(-' + position + '%)';
			this.defaults.container.style.webkitTransition = 'all ' + animateTime + 's ' + animateFunction;
			this.defaults.container.style.mozTransition = 'all ' + animateTime + 's ' + animateFunction;
			this.defaults.container.style.msTransition = 'all ' + animateTime + 's ' + animateFunction;
			this.defaults.container.style.transition = 'all ' + animateTime + 's ' + animateFunction;

			for (let i = 0; i < this.ul.childNodes.length; i++) {
					this.ul.childNodes[i].firstChild.classList.remove('active');
					if (i == this.defaults.currentPosition) {
					this.ul.childNodes[i].firstChild.classList.add('active');
				}
			}
		};

		this.changeCurrentPosition = function (position) {
			if (position !== "") {
				_self.defaults.currentPosition = position;
				location.hash = _self.defaults.currentPosition;
			}
		};

		return this;
	};
	window.fullScroll = fullScroll;
})();
new fullScroll({
	    // parent container
    container : 'main',

    // content section
    sections : 'section',

    // animation speed
    animateTime : 0.7,

    // easing for animation
    animateFunction : 'ease-in-out',

    // current position
    currentPosition: 0,

    // display dots navigation
    displayDots: true,

    // where to place the dots navigation
    dotsPosition: 'right'
});
function getProductSlider() {
    if (document.querySelectorAll('.product-slider')) {
        let productSliders = document.querySelectorAll('.product-slider');
        for (let slider of productSliders) {
            let slideCount = 4;
            let place = slider.querySelector('.items');
            let itemSliderItems = place.querySelectorAll('.item.slide');
            let arrowL = slider.querySelector('.arrow-l');
            let arrowR = slider.querySelector('.arrow-r');
            if (arrowL && arrowR) {
                arrowL.addEventListener('click', productSlideLeft);
                arrowR.addEventListener('click', productSlideRight);
            }
            if (!place.dataset.notouch) {
                slider.addEventListener('touchmove', function(e) {
                    handleTouchMove(e, productSlideRight, productSlideLeft);
                });
            }
            window.addEventListener('resize', function () {
                place.style.left = '0';
            });
            function productSlideLeft() {
                if (!place.dataset.p) {
                    place.dataset.p = 56;
                }
                if (document.documentElement.clientWidth <= '578') {
                    if (!place.dataset.pm) {
                        place.dataset.p = '24';
                    } else {
                        place.dataset.p = place.dataset.pm ;
                    }
                }
                let itemsWidth = 0;
                let nowLeft = 0;
                if (place.style.left) {
                    nowLeft = Math.abs(place.style.left.replace(/\D/g, ''));
                }
                let nextSlide = 0;
                for (let item of itemSliderItems) {
                    itemsWidth += Math.round(item.offsetWidth + Number(place.dataset.p));
                    if (itemsWidth < nowLeft) {
                        nextSlide = itemsWidth;
                    };
                }
                let left = nextSlide;
                if (left < 0) {
                    left = 0;
                } else {
                    slideCount--;
                }
                if (slideCount < 0) {
                    slideCount = 0;
                }
                place.style.left = '-' + left + 'px';
                if (slider.querySelector('.mobile-bubbles')) {
                    slider.querySelector('.mobile-bubbles .selected').classList.remove('selected');
                    slider.querySelectorAll('.mobile-bubbles div')[slideCount].classList.add('selected');
                }
            };
            function productSlideRight() {
                let placeWidth = place.offsetWidth;
                if (!place.dataset.p) {
                    place.dataset.p = 56;
                }
                if (document.documentElement.clientWidth <= '578') {
                    if (!place.dataset.pm) {
                        place.dataset.p = '24';
                    } else {
                        place.dataset.p = place.dataset.pm ;
                    }
                }
                let itemsWidth = 0;
                let nowLeft = 0;
                if (place.style.left) {
                    nowLeft = Math.abs(place.style.left.replace(/\D/g, ''));
                }
                let nextSlide = 0;
                for (let item of itemSliderItems) {
                    itemsWidth += Math.round(item.offsetWidth + Number(place.dataset.p));
                    if (nextSlide === 0 && itemsWidth > nowLeft) {
                        nextSlide = itemsWidth;
                        slideCount++;
                    };
                }
                if (slideCount >= itemSliderItems.length) {
                    slideCount = itemSliderItems.length - 1;
                }
                let left = nextSlide;
                if (left > itemsWidth - placeWidth) {
                    left = itemsWidth - placeWidth;
                }
                place.style.left = '-' + left + 'px';
                if (slider.querySelector('.mobile-bubbles')) {
                    slider.querySelector('.mobile-bubbles .selected').classList.remove('selected');
                    slider.querySelectorAll('.mobile-bubbles div')[slideCount].classList.add('selected');
                }
            };
        }

    }
}
getProductSlider();