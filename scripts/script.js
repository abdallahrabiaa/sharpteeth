
class API{
    constructor(){
    }
    static async getAreaAndFilter(area,areaAsSHown){
        if (area){
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`).then(res=>res.json()).then(data=>{
                Show.addMeal(data,areaAsSHown);

            }).catch(e=>console.log(e));
            return ;
        }
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list').then(resbonde=>resbonde.json()).then(data=>{
            const areas = data.meals;
            Show.feedAreaS(areas);
        })
    }
static filterByFirstLetter(letter){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`).then(res=>res.json()).then(data=>{
Show.addMeal(data);
        }).catch(e=>{
            console.log(e);
        })
}

    static async getSingleCategory(category){
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`).then(res=>res.json()).then(data=>{
            Show.addMeal(data,category);
        });


    }
    static async getCategories(){
        fetch('https://www.themealdb.com/api/json/v1/1/categories.php').then(res=>res.json()).then(data=> {
                Show.showNavItems(data);
            }
        );

    }
    static async getMealPage(id){
        const AllData= await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(AllData=>AllData.json())
            .then(lastdata=>{
                Show.showSinglePage(lastdata);
            })

    }
    static async Search4meal(name){
        this.SearchByName=`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
        try{
            const send= await fetch(this.SearchByName);
            const responde = await send.json();
            console.log(responde);
            Show.addMeal(responde);
        }catch(erorr){
            console.log(erorr);
        }
    }
    static  randomMeal(){
        fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(res=>
            res.json()
        ).then(data=>{
            console.log(data);
            Show.showSinglePage(data)});
    }
}
class Header {
    constructor() {
        this.header = document.querySelector('.header');
        this.form = this.header.querySelector('form');
        this.searchField = this.form.querySelector('input');
        this.submitButton= this.form.querySelector('button');
    }


}

class Searching extends Header{
    constructor(){
        super();
        this.form.addEventListener('submit',e=>{
            e.preventDefault();
            if(this.searchField.value.trim()===''){
                return alert('type the meal you want!');
            }
            this.term=this.searchField.value;
            document.querySelector('.result').innerHTML=null;
            API.Search4meal(this.term);
            this.searchField.value=null;
            document.body.querySelector('.main').style.display='block';

        })
        API.getCategories();
        Show.sideNav();
        API.getAreaAndFilter();
        API.randomMeal();
        Show.toggleButtonsSlide();
        Show.AddEventsToLi();
        Show.ShowLetters();
    }
}
class Show {
static modalController(videoUrl,videoName) {
    const timesButton = document.querySelector('.modal_toggle_button');
    const modalCont = document.querySelector('.modal_container');
    const modal = document.querySelector('.modal');
    modalCont.classList.add('modal_container_show');
    if (modalCont.classList.contains('modal_container_show')) {
        timesButton.addEventListener('click', () => {
            modalCont.classList.remove('modal_container_show');

        })

        window.addEventListener('click', (e) => {
            (e.target !== modal) ? modalCont.classList.remove('modal_container_show') : false;

        })

            modal.querySelector('.modal_inner').innerHTML = `<p>there no available meals by this name ! </p>`


    }
}

    static feedAreaS(areas) {
        const areaList = document.getElementById('AreaList');
        areas.map(area => {
            const liArea = document.createElement('li');
            liArea.innerHTML = `
         ${area.strArea}
         `;
            liArea.dataset.mealid = area.strArea;
            liArea.id = area.strArea;
            areaList.append(liArea);
            liArea.addEventListener('click',(e)=>{

                API.getAreaAndFilter(e.target.dataset.mealid,e.target.dataset.mealid);
            });
        });


    }
    static ShowLetters(data){
        const lettersList = document.getElementById('lettersList');
        const lettersButton =document.getElementById('lettersButton');
        lettersButton.addEventListener('click',()=> {
            lettersList.classList.toggle('nav_list_toggle');
            const Lis = lettersList.querySelectorAll('li');
            Lis.forEach(li => li.addEventListener('click', (e) => {
                API.filterByFirstLetter(e.target.innerHTML);
            }))
            lettersButton.addEventListener('click',()=>{
                lettersList.classList.add('nav_list_toggle');

            })
if (lettersList.style.display!=='none'){
    lettersButton.addEventListener('click',()=>{
        lettersList.classList.add('nav_list_toggle');

    })
    if (lettersList.style.display!=='none'){
        window.addEventListener('click',(e)=>{
            if(e.target!==lettersList&&e.target!==lettersButton){
                lettersList.classList.remove('nav_list_toggle');

            }
    } )
    }



}






        })
    }
    static toggleButtonsSlide() {
        const areaList = document.querySelector('#AreaList');
        const areaButton = document.getElementById('areaS');
        areaButton.addEventListener('click', () => {
            areaList.classList.add('nav_list_toggle');
        })
        if (areaList.style.display !== 'none') {
            window.addEventListener('click', (e) => {
                if (e.target !== areaList && e.target !== areaButton) {
                    areaList.classList.remove('nav_list_toggle');

                }
            })
        }

        const randomMealButton = document.getElementById('randomMeal');
        randomMealButton.addEventListener('click', () => {
            API.randomMeal();
        })


    }

    static AddEventsToLi(){
        const areaButton = document.getElementById('areaS');



    }


    static showNavItems(cat){
        cat.categories.forEach(c=> {
                const ilC = document.createElement('li');
                const cDiv = document.createElement('div');
                ilC.append(cDiv);
                cDiv.className='categories';
                cDiv.innerHTML=`
        <h2>${c.strCategory}</h2>
        <img src="${c.strCategoryThumb}" alt="${c.strCategory}">
             `;
                ilC.setAttribute('data-cat',c.strCategory);
                document.querySelector('aside ul').append(ilC);
                cDiv.addEventListener('click',(event)=>{
                    API.getSingleCategory(event.target.closest('li').dataset.cat);
                    document.body.classList.toggle('sideNavToggled');
                })
            }
        )

    }
    static sideNav(){
        document.querySelector('.sideNav_button').onclick=()=>{
            document.body.classList.toggle('sideNavToggled');

        }
        document.querySelector('.times').onclick=()=>{
            document.body.classList.toggle('sideNavToggled');
        }
    }
    static addMeal(m,category){
        if (m.meals===null){
            Show.modalController(m.meals);
            return;
        }
        if (document.querySelector('.result')){
            document.querySelector('.result').innerHTML=null;
        }
        if(document.querySelector('.meal_section'))     {
            document.querySelector('.meal_section').innerHTML=null;
        }

        const temp =document.querySelector('template').content;
        m.meals.map(meal=>{
            const mealCont = document.importNode(temp,true);
            mealCont.querySelector('img').src=meal.strMealThumb;
            mealCont.querySelector('img').alt=meal.strMeal;
            mealCont.querySelector('p').textContent=meal.strMeal;
            if(meal.strArea){
                mealCont.querySelector('.cat_origin').textContent=meal.strArea;
                mealCont.querySelector('.cat_video').href=meal.strYoutube;
                mealCont.querySelector('.cat_type').textContent=meal.strCategory;


            }else{
                mealCont.querySelector('.cat_origin').textContent=`${meal.strMeal[0]} letter`;
                mealCont.querySelector('.cat_type').textContent=category;
                mealCont.querySelector('.cat_video').style.display='none';


            }

            mealCont.querySelector('.meal_container').dataset.id=meal.idMeal;
            document.querySelector('.result').append(mealCont);
        })

        this.showMealPage();
    }
    static showMealPage(){
        const all= document.querySelector('.result').children;
        for(let i=0 ; i<all.length; i++  ){
            all[i].children[0].onclick=(e)=>{
                e.target.closest('.meal_container').dataset.id;
                API.getMealPage(e.target.closest('.meal_container').dataset.id)
            }

        }
    }
    static showSinglePage(info) {
        if (document.querySelector('.result')){
            document.querySelector('.result').innerHTML=null;
        }
        if(document.querySelector('.meal_section')){
            document.querySelector('.meal_section').innerHTML=null;
        }
        const theMeal = info.meals[0];
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('mealPage');
        mealDiv.innerHTML = `
<div class="the_meal_info">
 <h1 class="single_meal_name"></h1>
 <img src="" alt="" class="single_meal_img">

</div>
 <h2 class="typo">Ingredients:</h2>
 <div class="inT">
</div>
       <div class="meal_inst">
     <h2 class="typo">Instructions:</h2>
           <p class="meal_ins"></p>

           </div>
            <div class="cat">
                <div class="cat_type">first</div>
                <div class="cat_origin">second</div>
                <div ><a class="cat_video" href="" target="_blank" ><img src="imgs/video-solid.svg" alt="video for meal"></a></div>
            </div>
      `;
        mealDiv.querySelector('h1').textContent = theMeal.strMeal;
        mealDiv.querySelector('img').src = theMeal.strMealThumb;
        mealDiv.querySelector('.meal_ins').textContent = `
${theMeal.strInstructions}`;
        mealDiv.querySelector('.cat_origin').textContent = theMeal.strArea;
        mealDiv.querySelector('.cat_type').textContent = theMeal.strCategory;
        mealDiv.querySelector('.cat_video').href = theMeal.strYoutube;
        document.querySelector('.meal_section').append(mealDiv);
        let ingredients =[];
        for (let i = 1; i <= 20; i++) {
            if (theMeal[`strIngredient${[i]}`]) {
                ingredients.push(`${theMeal[`strIngredient${[i]}`]}-${theMeal[`strMeasure${[i]}`]}`);

            } else {
                break;
            }

        }
        ingredients.forEach(int=>{
            let intge =document.createElement('div');
            intge.textContent=int;
            intge.classList.add('meal_int');
            document.querySelector('.inT').append(intge);

        })



    }

}



new Searching();
