const likeBtn = document.getElementById('like');
const dislikeBtn = document.getElementById('dislike');

likeBtn.addEventListener('click', (e) => {
    console.log('request la like route')
    giveRating(1);
})

dislikeBtn.addEventListener('click', (e) => {
    console.log('request la dislike route');
    giveRating(-1);
})

function giveRating(vote){
    fetch(`http://localhost:3000/content/rate/${likeBtn.value}/${vote}`, {
        method:'GET',
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then( response => response.json()).then( data => {
        console.log(data.message)
        document.getElementById('log').innerText = data.message
    } )
}