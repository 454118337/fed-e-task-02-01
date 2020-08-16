$(($) => {
    const $body = $('html body');
    $('#scroll_top').on('click', () => {
        $body.animate({scrollTop: 10}, 600)
        return false
    })
})