module.exports = {
    renderHtml(tamplate, data) {
        return tamplate(data)
    },
    renderData(data) {
        return `<a href="#" class="balloon_body__link" data-coords="${data.coords}">${data.address}</a><br>
        <p>${data.commentText}</p>`
    }
};