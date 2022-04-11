const contentModel = require('../models/Content');
const seriesModel = require('../models/Series');

//input : 
//          films - ariked films )ray of films with their ObjecID's (preferrably the user l
//output:   the top 3 categories preffered by the user
const recommendFilms = async (films) => {
    let favCategories = []
    if(!films)
        return;
    for (let index = 1; index < films.length; index++) { //parcurgem toate filmele date
        let film = films[index];
        const filmObj = await contentModel.findById(film).populate('category')
        const category = filmObj.category
        //console.log(favCategories)
        const alreadyCategory = favCategories.find( categ => categ._id === category._id.toString())
        //console.log(alreadyCategory)
        if(!alreadyCategory){
            favCategories.push({
                '_id' : category._id.toString(),
                'count' : 1 
            });
        }
        else alreadyCategory['count']++;
    }
    favCategories.sort( (a, b) => b.count - a.count)//sort desceding based on the frequency of the category 
    if(favCategories.length <= 3) //daca momentan sunt mai putin de 3 categorii apreciate
        return favCategories
    return [favCategories[0] , favCategories[1], favCategories[2]] //daca sunt mai multe categorii apreciate le luam doar pe primele 3
}

//input : 
//          films - ariked films )ray of films with their ObjecID's (preferrably the user l
const recommendFilmsByRating = async (films, filmsViewed) => {
    let sum = 0
    const limit = 1

    if(!films)
        return []

    for(let i = 0; i < films.length; i++){
        const el = await contentModel.findById(films[i]).lean()
        
        if(el && el.likes >= 0 && el.dislikes >= 0 && el.views >= 0){
            console.log(el)
            sum += (el.likes + el.dislikes + el.views)
        }
           
    }
    //console.log(`sum is : ${sum}`)

    const average  = sum / films.length

    //console.log(average)

    const allFilms = await contentModel.find({})

    const result = []

    for(let i = 0; i < allFilms.length; i++){
        if (!filmsViewed.includes(allFilms[i])){
            if(allFilms[i] && allFilms[i].likes >= 0 && allFilms[i].dislikes >= 0 && allFilms[i].views >= 0){
                const currentRating = allFilms[i].likes + allFilms[i].dislikes + allFilms[i].views
                if(Math.abs(currentRating - average) <= limit){ //daca e in limita 
                    if (allFilms[i].parentSeries != null){ //daca e parte dintr-un serial
                        const sa = await contentModel.findOne({_id : allFilms[i]._id}).populate('parentSeries').lean()
                        result.push(sa.parentSeries) //adaugam serialul in array-ul rezultat
                    }
                    else
                        result.push(allFilms[i])
                }
            }
        }
    }
    //calculam media de rating a tuturor filmelor like-uite 
    // const filmsObjects = films.map( async el => await contentModel.findById(el) )
    // console.log(filmsObjects)
    return result
}

async function getRandomContentFromCategories(categories, contentViewed) {
    let resultContent = []
    //console.log(categories)
    if(!categories)
        return;
    for(let i = 0; i < categories.length; i++){ //parcurgem categoriile 
        const randomContent = await contentModel.find({category: categories[i], parentSeries : null}) //luam content random din categoria curenta
        //console.log('content random : ')
        //console.log(randomContent)
        for(let j = 0; j < randomContent.length; j++) { //parcurgem continututirle 
            if(!contentViewed.find( el => el.toString() == randomContent[j]._id.toString())){
                resultContent.push(randomContent[j])
            }
        }
    }
    return resultContent
}

async function getRandomSeriesRecomended(categories, contentViewed) {
    let resultContent = []
    //console.log(categories)
    if(!categories)
        return;
    const serieses = await seriesModel.find().lean()
    for(let i = 0; i < categories.length; i++){
        for(let j = 0; j < serieses.length; j++){
            const content = await contentModel.findOne({parentSeries : serieses[j]._id, category : categories[i]._id}).lean()
            if(content && !contentViewed.find( el => el.toString() == content._id.toString()))
                resultContent.push(serieses[j])
        }
    }
    return resultContent
}

module.exports = {
    recommendFilms,
    getRandomContentFromCategories,
    getRandomSeriesRecomended,
    recommendFilmsByRating
}