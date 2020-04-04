console.log("Index script file included !!!")
let cachedData = [];

var SearchByKeyWord = _.debounce(function(word) {
    if (word.length === 0) {
        renderCard([...cachedData]);
        return;
    }
    const filterEl = cachedData.filter(
        el => {
            const {
                Title
            } = el;
            if (Title.toLowerCase().startsWith(word.toLowerCase())) {
                return true;
            } else {
                return false;
            }
        }
    )
    renderCard([...filterEl]);
}, 1000);

function setFav(imdbID, isAdd) {
    let items = JSON.parse(localStorage.getItem("fav") || "[]");
    if (!isAdd) {
        items = items.filter(id => id !== imdbID);
    } else {
        items.push(imdbID);
    }
    localStorage.setItem("fav", JSON.stringify(items));
    renderCard(cachedData)
}

function Header() {
    const html = `<nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <a class="navbar-brand" href="#">Movie App JS</a>
        <div class="form-inline">
            <input onkeyup="SearchByKeyWord(document.getElementById('search').value)" id="search" class="form-control mr-sm-2" type="text" placeholder="Search movies">
        </div>
  </nav> `;
    const header = document.getElementById("header");
    if (header) {
        header.innerHTML = html;
    }
}


async function getData() {
    const result = document.getElementById("result");
    if (result) {
        result.innerHTML = "<h3>Loading.....</h3>";
    }
    const url = "https://www.omdbapi.com/?s=man&apikey=4a3b711b";
    const response = await fetch(url);
    const data = await response.json();
    const {
        Search
    } = data;
    if (Search.length > 0) {
        cachedData = Search;
        renderCard([...Search]);
    }
}

function getFavButton(fav, element) {
    if (!fav.includes(element.imdbID)) {
        return `<button type="button" class="btn btn-primary" onclick="setFav('${element.imdbID}',true)">Add as Favourite</button>`
    } else {
        return `<button type="button" class="btn btn-primary" onclick="setFav('${element.imdbID}',false)">remove</button>`
    }
}

function renderCard(data) {
    if (data.length === 0) {
        const result = document.getElementById("result");
        if (result) {
            result.innerHTML = "<h3>No result found</h3>";
        }
        return;
    }
    const fav = JSON.parse(localStorage.getItem("fav") || "[]");
    let html = '<div class="row">';
    data.forEach(element => {
        html += `
            <div class="col-sm-6">
                <div class="card" style="width:400px">
                    <img class="card-img-top" src=${element.Poster} alt="Card image" style="width:100%; height:300px;">
                    <div class="card-body">
                        <h4 class="card-title">${element.Title}</h4>
                        ${getFavButton(fav, element)}
                        
                    </div>
               </div>
            </div>
        `;
    });
    html += '</div>';
    const result = document.getElementById("result");
    if (result) {
        result.innerHTML = html;
    }
}




(function() {
    Header();
    getData();
})();