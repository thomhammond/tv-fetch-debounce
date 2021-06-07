// const aniston = fetch("https://api.tvmaze.com/search/people?q=jennifer%20aniston").then(response => console.log(response));

const searchForm = document.querySelector(".search-form");
const actorsContainer = document.querySelector(".actors");

const getActors = async (actor) => {
    actor = actor.toLowerCase().replace(/ /g, "%20");

    const personObj = await fetch(`https://api.tvmaze.com/search/people?q=${actor}`).then(response => response.json());
    
    const people = [];
    for (let person of personObj) {
        let name = person.person.name;
        let id = person.person.id;
        people.push({name, id});
    }
    if (!personObj.length) {
        people.push({name: "No Results", id: null});
    }
    addActors(people);
}

const addActors = (people) => {
    while (actorsContainer.lastChild) {
        actorsContainer.removeChild(actorsContainer.lastChild);
    }
    for (let person of people) {
        const newActor = document.createElement("h3");
        newActor.textContent = person.name;
        newActor.addEventListener("click", () => {
            getShows(person.id);
        });
        actorsContainer.appendChild(newActor);
    }  
}

const getShows = async (actorId) => {
    const showsObj = await fetch(`https://api.tvmaze.com/people/${actorId}/castcredits`).then(response => response.json());

    const shows = [];
    if (showsObj.length) {
        for (let show of showsObj) {
            shows.push(show._links.show.href);
        };
    };
    addShows(shows);

}

const addShows = async (shows) => {
    while (actorsContainer.lastChild) {
        actorsContainer.removeChild(actorsContainer.lastChild);
    }
    if (!shows.length) {
        const noShow = document.createElement("h3");
        noShow.textContent = "No Results";
        actorsContainer.appendChild(noShow);
    }
    for (let show of shows) {
        const newShow = document.createElement("div");
        const showName = document.createElement("h3");
        const showImg = document.createElement("img");

        let currShow = await fetch(show).then(response => response.json());

        showName.textContent = currShow.name;
        if (currShow.image && currShow.image.medium) {
            showImg.src = currShow.image.medium;
        }
        
        newShow.appendChild(showImg);
        newShow.appendChild(showName);

        actorsContainer.appendChild(newShow); 
    }
}

const debounce = function(func, timeout=300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {func.apply(this, args);}, timeout)
    }
}



const processChange = debounce((result) => {
    getActors(result);
});

searchForm.addEventListener("keyup", function(e) {
    e.preventDefault();
    processChange(this.elements.actor.value);
});
