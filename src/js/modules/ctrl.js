import Tmpl from '../../template/view.hbs';
import yandexApi from './init.js';
import Model from './mdl.js';
import View from './view.js';

module.exports = {
    init() {
        yandexApi.then(api => {
            let placemarks = Model.getPlacemarks();

            if (placemarks) {
                placemarks.forEach(placemark => {
                    let reviews = placemark.reviews;
                    let myPlacemarks = reviews.map(review => {
                        let config = {
                            location: review.location,
                            coords: placemark.coords,
                            address: placemark.address,
                            date: review.date,
                            commentText: review.commentText
                        };

                        return this.createPlacemark(placemark.coords, config);
                    });

                    api.clusterer.add(myPlacemarks);
                });
            }
        });

        this.hidePopup();
        this.addPoint();
        this.markCoords(this);
        this.clickPoint(this);
        this.clickBalloonLink();
    },    

    showPopup(reviewObj) {
        let popup = document.querySelector('#popup');
        let popupTitle = popup.querySelector('.popup__title');
        let reviews = document.querySelector('.reviews__list');

        this.resetFormInputs();

        reviews.innerHTML = '';

        if (reviewObj) {
            let coords = reviewObj.coords;
            let address = reviewObj.address;

            Model.setLocation({ coords: coords, address: address });
            popupTitle.innerText = address;
            reviewObj.reviews.forEach(review => {
                reviews.innerHTML += View.renderHtml(Tmpl, review);
            })
        } else {
            popupTitle.innerText = Model.getLocation().address;
        }

        popup.style.display = 'block';
    },

    markCoords(_this) {
        yandexApi.then(api => {
            api.yandexMap.events.add('click', e => {
                let coords = e.get('coords');

                ymaps.geocode(coords).then(result => {
                    let address = result.geoObjects.get(0).properties.get('text');

                    Model.setLocation({ coords: coords, address: address });
                    _this.showPopup();
                });
            });
        });
    },

    createPlacemark(coords, config) {
        const myPlacemark = new ymaps.Placemark(coords, {
            balloonContentHeader: config.location,
            balloonContentBody: View.renderData(config),
            balloonContentFooter: config.date
        });

        return myPlacemark;
    },

    clickBalloonLink() {
        document.addEventListener('click', e => {
            let targetCoords = e.target.dataset.coords;

            if (targetCoords) {
                e.preventDefault();
                let reviews = Model.getPlacemarks();
                let coordsString = targetCoords.split(',');
                let coords = coordsString.map(coord => {
                    return +coord;
                });

                for (let i = 0; i < reviews.length; i++) {
                    let review = reviews[i];

                    if (review.coords.join('') == coords.join('')) {
                        this.showPopup(review);
                        break;
                    }
                }
            }
        });
    },

    clickPoint(_this) {
        yandexApi.then(api => {
            api.yandexMap.geoObjects.events.add('click', e => {
                let target = e.get('target')

                if (target.options.getName() == 'geoObject') {
                    e.preventDefault();
                    let coords = target.geometry.getCoordinates();
                    let reviews = Model.getPlacemarks();

                    reviews.forEach(review => {
                        if (review.coords == coords) {
                            _this.showPopup(review);
                        }
                    });
                }
            });
        });
    },

    hidePopup() {
        let close = document.querySelector('.btn_action_close');

        close.addEventListener('click', e => {
            let popup = e.target.closest('.popup');

            popup.style.display = 'none';

            this.resetFormInputs();
        });
    },    

    addPoint() {
        const addButton = document.querySelector('#btn_action_add');

        addButton.addEventListener('click', e => {
            e.preventDefault();

            let formInputs = document.querySelectorAll('*[data-key]');
            let inputData = Model.getformInputsData(formInputs);
            let reviews = document.querySelector('.reviews__list');
            let location = Model.getLocation();
            let placemark = {
                coords: location.coords,
                address: location.address,
                reviews: [inputData]
            };
            let config = {
                location: inputData.location,
                coords: location.coords,
                address: location.address,
                date: inputData.date,
                commentText: inputData.commentText
            };
            
            let myPlacemark = this.createPlacemark(location.coords, config);
            let userName = document.querySelector('.review-form__input');
            let userLocation = document.querySelector('.loc');
            let userComment = document.querySelector('.review-form__textarea');

            if (userName.value !=='' && userLocation.value !=='' && userComment.value !=='') {

                reviews.innerHTML += View.renderHtml(Tmpl, inputData);
                yandexApi.then(api => {
                    api.clusterer.add(myPlacemark);
                });

                Model.updatePlacemarks(placemark, inputData);
                localStorage.placemarks = JSON.stringify(Model.getPlacemarks());
                
                this.resetFormInputs();
            }
        });        
    }, 
    
    resetFormInputs () {
        let userName = document.querySelector('.review-form__input');
        let userLocaton = document.querySelector('.loc');
        let userComment = document.querySelector('.review-form__textarea');

        userLocaton.value ='';
        userName.value ='';
        userComment.value ='';
    },  
};