module.exports = (() => {
    let yandexMap,
        clusterer;

    return new Promise(resolve => ymaps.ready(resolve))
        .then(() => {
            yandexMap = new ymaps.Map('ya_maps', {
                center: [-22.98, -43.21],
                zoom: 10,
                controls: ['geolocationControl', 'searchControl']
            });

            var customItemContentLayout = ymaps.templateLayoutFactory.createClass(                
                '<h2 class=balloon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
                '<div class=balloon_body>{{ properties.balloonContentBody|raw }}</div>' +
                '<div class=balloon_footer>{{ properties.balloonContentFooter|raw }}</div>'
            );
            
            clusterer = new ymaps.Clusterer({                
                clusterDisableClickZoom: true,
                openBalloonOnClick: true,
                clusterBalloonContentLayout: 'cluster#balloonCarousel',                
                clusterBalloonItemContentLayout: customItemContentLayout
            });

            yandexMap.geoObjects.add(clusterer);

            return {
                yandexMap,
                clusterer,
            }
        });
})();