const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const likedContent = []

checkboxes.forEach( (checkbox) => {
    checkbox.addEventListener('change', () => {
        if (!this.checked) {
            likedContent.push(checkbox.value)
        } else {
            likedContent.splice(likedContent.indexOf(this.value))
        }
    })
})

document.getElementById('sendPreferences').addEventListener('click', async () => {
    await fetch('/sendLikedContent', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({firstlikedContent: likedContent}) // body data type must match "Content-Type" header
    });
    window.location.href = '/profiles'
})