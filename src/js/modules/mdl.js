module.exports = {
    location: null,

    setLocation(data) {
        this.location = data;
    },

    getLocation() {
        return this.location;
    },
    
    getDate() {
        let date = new Date();
        let day = date.getDate();
        let customDay = day < 10 ? '0' + day : day;
        let month = date.getMonth() + 1;
        let customMonth = month < 10 ? '0' + month : month;
        let year = date.getFullYear();
        let hours = date.getHours();
        let customHours = hours < 10 ? '0' + hours : hours;
        let minutes = date.getMinutes();
        let customMinutes = minutes < 10 ? '0' + minutes : minutes;
        let seconds = date.getSeconds();
        let customSeconds = seconds < 10 ? '0' + seconds : seconds;
        let fullDate = `${customDay}/${customMonth}/${year}`;
        let fullTime = `${customHours}:${customMinutes}:${customSeconds}`;

        return `${fullTime} ${fullDate}`;
    },

    getformInputsData(formInputs) {
        let inputData = {};

        inputData.date = this.getDate();

        for (let i = 0; i < formInputs.length; i++) {
            let inputAttributes = formInputs[i].dataset.key;
            let inputValue = formInputs[i].value;

            inputData[inputAttributes] = inputValue;
        }

        return inputData;
    },

    placemarks: null,

    getPlacemarks() {
        if (this.placemarks != null) {
            return this.placemarks;
        }
        
        if (localStorage.placemarks) {
            this.placemarks = JSON.parse(localStorage.placemarks);

            return this.placemarks;
        }
                
        this.placemarks = [];

        return this.placemarks; 
    },

    updatePlacemarks(placemark, data) {
        if (this.placemarks.length) {
            let existPlacemark = false;

            this.placemarks.forEach(placemark => {
                if (placemark.coords.join('') == this.location.coords.join('')) {
                    placemark.reviews.push(data);
                    existPlacemark = true;
                }
            });

            if (!existPlacemark) {
                this.placemarks.push(placemark);
            }
        } else {
            this.placemarks.push(placemark);
        }
    },   
}