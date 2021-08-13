function getMainSlider() {
    let mainSliders = document.querySelectorAll('.main-slider');
    for (let mainSlider of mainSliders) {
        let titleCash;
        if (mainSlider.querySelector('.control-panel')) {
            titleCash = mainSlider.querySelector('.control-panel .title').innerHTML;
        }
        let mainSliderArrowLeft = mainSlider.querySelector('.arrow-left');
        let mainSliderArrowRight = mainSlider.querySelector('.arrow-right');
        let mainSliderSliders = mainSlider.querySelector('.slides');
        let mainSliderItems = mainSliderSliders.querySelectorAll('.slide');
        let mainSliderBubbles;
        let slideNow = 0;
        if (mainSlider.querySelector('.bubles div')) {
            mainSliderBubbles = mainSlider.querySelectorAll('.bubles div');
            for (let i = 0; i < mainSliderBubbles.length; i++) {
                mainSliderBubbles[i].addEventListener('click', function() {
                    slideNow = i - 1;
                    nextMainSlider();
                });
            }
        }
        let mainSlideNext = true;
        let time = 5000;
        if (mainSlider.dataset.timer) {
            time = Number(mainSlider.dataset.timer);
        }
        let sliderTimer = setInterval(nextMainSlider, time);
        if (mainSlider.querySelector('.arrow-left') && mainSlider.querySelector('.arrow-right')) {
            mainSliderArrowRight.addEventListener('click', nextMainSlider);
            mainSliderArrowLeft.addEventListener('click', prevMainSlider);
        }
        mainSlider.addEventListener('touchmove', function(e) {
            handleTouchMove(e, nextMainSlider, prevMainSlider);
        });
        function nextMainSlider() {
            if (!mainSlideNext || mainSliderItems.length < 2) {
                return;
            }
            if (mainSlider.querySelector('video')) {
                for (let video of mainSlider.querySelectorAll('video')) {
                    video.pause();
                }
            }
            mainSlideNext = false;
            setTimeout(function() {
                mainSlideNext = true;
            }, 640);
            let width = mainSlider.querySelector('.slides').scrollWidth;
            let slideWidth = width / mainSliderItems.length;
            slideNow++;
            if (slideNow > mainSliderItems.length - 1) {
                slideNow = 0;
                mainSliderSliders.style.transition = 'left 0s';
                let item = mainSliderItems[mainSliderItems.length - 1];
                mainSliderSliders.insertBefore(item, mainSliderItems[0]);
                mainSliderSliders.style.left = '0';
                setTimeout(function() {
                    mainSliderSliders.style.transition = '';
                    mainSliderSliders.style.left = -(slideWidth * 1) + 'px';
                }, 20);
                setTimeout(function() {
                    mainSliderSliders.style.transition = 'left 0s';
                    mainSliderSliders.appendChild(item);
                    mainSliderSliders.style.left = '0';
                    setTimeout(function() {
                        mainSliderSliders.style.transition = '';
                    }, 20);
                }, 600);
            } else {
                mainSliderSliders.style.left = -(slideWidth * slideNow) + 'px';
            }
            if (mainSlider.querySelector('.bubles .active')) {
                mainSlider.querySelector('.bubles .active').classList.remove('active');
                mainSliderBubbles[slideNow].classList.add('active');
            }
            if (mainSlider.querySelector('.counter')) {
                mainSlider.querySelector('.counter').innerHTML = `0${slideNow + 1}`;
            }
            clearInterval(sliderTimer);
            sliderTimer = setInterval(nextMainSlider, time);
            if (mainSlider.querySelector('.control-panel')) {
                nextNewsTab(mainSlider);
            }
        }

        function prevMainSlider() {
            if (!mainSlideNext || mainSliderItems.length < 2) {
                return;
            }
            if (mainSlider.querySelector('video')) {
                for (let video of mainSlider.querySelectorAll('video')) {
                    video.pause();
                }
            }
            mainSlideNext = false;
            setTimeout(function() {
                mainSlideNext = true;
            }, 640);
            let width = mainSlider.querySelector('.slides').scrollWidth;
            let slideWidth = width / mainSliderItems.length;
            slideNow--;
            if (slideNow < 0) {
                slideNow = mainSliderItems.length - 1;
                mainSliderSliders.style.transition = 'left 0s';
                let item = mainSliderItems[0];
                mainSliderSliders.appendChild(item);
                mainSliderSliders.style.left = -slideWidth * (mainSliderItems.length - 1) + 'px';
                setTimeout(function() {
                    mainSliderSliders.style.transition = '';
                    mainSliderSliders.style.left = -(slideWidth * (mainSliderItems.length - 2)) + 'px';
                }, 20);
                setTimeout(function() {
                    mainSliderSliders.style.transition = 'left 0s';
                    mainSliderSliders.insertBefore(item, mainSliderItems[1]);
                    mainSliderSliders.style.left = -slideWidth * (mainSliderItems.length - 1) + 'px';
                    setTimeout(function() {
                        mainSliderSliders.style.transition = '';
                    }, 20);
                }, 600);
            } else {
                mainSlider.querySelector('.slides').style.left = -(slideWidth * slideNow) + 'px';
            }
            if (mainSlider.querySelector('.bubles .active')) {
                mainSlider.querySelector('.bubles .active').classList.remove('selected');
                mainSliderBubbles[slideNow].classList.add('selected');
            }
            if (mainSlider.querySelector('.counter')) {
                mainSlider.querySelector('.counter').innerHTML = `0${slideNow + 1}`;
            }
            clearInterval(sliderTimer);
            sliderTimer = setInterval(nextMainSlider, time);
            if (mainSlider.querySelector('.control-panel')) {
                prevNewsTab(mainSlider);
            }
        };
        window.addEventListener('resize', function () {
            slideNow = 1;
            prevMainSlider();
            if (mainSlider.querySelector('.control-panel')) {
                mainSlider.querySelector('.control-panel .title').innerHTML = titleCash;
            }
        });
    }
}
getMainSlider();