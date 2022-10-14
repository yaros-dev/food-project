window.addEventListener('DOMContentLoaded', () => {
    //Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {

        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active')
        });

    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (e) => { // e - об'єкт події
        const target = e.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((element, i) => {
                if (target == element) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Timer

    const deadline = '2021-11-05';


    function getTimeRemaing(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            seconds = Math.floor((t / 1000) % 60),
                minutes = Math.floor((t / 1000 / 60) % 60),
                hours = Math.floor((t / (1000 * 60 * 60)) % 24),
                days = Math.floor(t / (1000 * 60 * 60 * 24));
        }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds');
        timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaing(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline)


    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });


    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 5000)


    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //Card Класи для карточок

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 42.50;
            this.changeToUAH(); // визиваємо раніше щоб порахувати ціну
        }
        changeToUAH() {
            this.price = Math.floor(this.price * this.transfer);
        }

        render() { // Створюємо верстку на сторінці
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = 'menu__item';
                element.classList.add(this.classes)
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }


            element.innerHTML = ` 
        <img src=${this.src} alt =${this.alt} >
        <h3 class = "menu__item-subtitle">${this.title}</h3> 
        <div class = "menu__item-descr">${this.descr}</div>
        <div class = "menu__item-divider"> </div> 
        <div class = "menu__item-price">
          <div class = "menu__item-cost"> Цена: </div> 
          <div class = "menu__item-total"> <span>${this.price}</span> грн/день</div> 
        </div> 
      `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };

    //  getResource('http://localhost:3000/menu')
    //  .then(data => {
    //     data.forEach( ({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //     });
    //  });

    //AXIOS 
    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        })

    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({
    //         img,
    //         altimg,
    //         title,
    //         descr,
    //         price
    //     }) => {
    //         const element = document.createElement('div');
    //         element.classList.add('menu__item');
    //         element.innerHTML = ` 
    //         <img src=${img} alt =${altimg} >
    //         <h3 class = "menu__item-subtitle">${title}</h3> 
    //         <div class = "menu__item-descr">${descr}</div>
    //         <div class = "menu__item-divider"> </div> 
    //         <div class = "menu__item-price">
    //           <div class = "menu__item-cost"> Цена: </div> 
    //           <div class = "menu__item-total"> <span>${Math.floor(price*42.50)}</span> грн/день</div> 
    //         </div>  `;
    //         document.querySelector('.menu .container').append(element);

    //     });
    // };

    // створюємо об'єкт на місці і визиваєм метод render(), створений об'єкт відразу видалиться з пам'яті після виконання методуб так як немає змінної.

    //Forms 

    const forms = document.querySelectorAll('form');
    const message = {
        loading: '../img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };


    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                })
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    //Slider v.2
    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    function dotsActive() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    function addZero() {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    function moveSlide() {
        slidesField.style.transform = `translateX(-${offset}px)`;
    }

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '')
    }

    next.addEventListener('click', () => {
        if (offset == (deleteNotDigits(width) * (slides.length - 1))) {
            offset = 0;
        } else {
            offset += deleteNotDigits(width);
        }
        moveSlide();
        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        addZero();
        dotsActive();
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = deleteNotDigits(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width);
        }

        moveSlide();

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        addZero();
        dotsActive();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;
            offset = deleteNotDigits(width) * (slideTo - 1);
            moveSlide();
            addZero();
            dotsActive();
        });
    });

    //Calc

    const result = document.querySelector('.calculating__result span')
    let sex = 'female', height, weight, age, ratio = 1.375;

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____'
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    
    function getStaticInfo(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(element => {
            element.addEventListener('click', (e) => { 

                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                } else {
                    sex = e.target.getAttribute('id');
                }

                elements.forEach(element => {
                    element.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });

    }

    getStaticInfo('#gender', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);
        input.addEventListener('input', () => {
            
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break; 
            }
            calcTotal();
        });
    }

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');









});





//Slider v.1
// showSlides(slideIndex);

// if (slides.length < 10) {
//     total.textContent = `0${slides.length}`;
// } else {
//     total.textContent =  slides.length;
// }

// function showSlides(n) {

//     if (n > slides.length) {
//         slideIndex = 1;
//     }
//     if (n < 1) {
//         slideIndex = slides.length;
//     }
//     slides.forEach(slide => slide.classList.add('hide'));
//     slides.forEach(slide => slide.classList.remove('show'));
//     slides[slideIndex - 1].classList.add('show', 'fade');
//     slides[slideIndex - 1].classList.remove('hide');

//     if (slides.length < 10) {
//         current.textContent = `0${slideIndex}`;
//     } else {
//         current.textContent = slideIndex;
//     } 
// };

// function plusSlides(n) {
//     showSlides(slideIndex += n)
// }
// prev.addEventListener('click', () => {
//     plusSlides(-1);
// })
// next.addEventListener('click', () => {
//     plusSlides(1);
// })

//Slider v.1

// const delay = ms => {
//     return new Promise(r => setTimeout(() => r(), ms))
// }

// const url = 'https://jsonplaceholder.typicode.com/todos';

// async function fetchAsyncTodos() {
//     console.log('fetch todos started......');
//     try {
//         await delay(2000);
//         const responce = await fetch(url)
//         const data = await responce.json()
//         console.log('data:', data);
//     } catch (e) {
//         console.error(e);
//     } finally {
//         console.log('Data download');
//     }
// }

// fetchAsyncTodos()