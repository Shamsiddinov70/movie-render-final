let KINOLAR = movies.slice(0, 50);
let elForm = document.querySelector('.js-form');
let elSelect = document.querySelector('.js-select');
let elSearch = document.querySelector('.js-search');
let elRatingSelect = document.querySelector('.select-rating');
let elWarapper = document.querySelector('.wrapper');
let elTemplate = document.getElementById('template').content;

let elPageCounter = document.querySelector('.page-counter');
let elPrevBtn = document.querySelector('.prev-btn');
let elNextBtn = document.querySelector('.next-btn');
let bookmarkWrapper = document.getElementById('bookmark-wrapper');
let elBookmarkTemplate = document.getElementById('bookmark-template').content;
let bookmarkList = document.querySelector('.bookmark-list');
let modalTitle = document.querySelector('.modal-title');
let modalSummary = document.querySelector('.modal-summary');
let modalImg = document.querySelector('.modal-img');
let modalLink = document.querySelector('.modal-link');


let page = 1;
let limit = 8;
let maxPageCounter = Math.ceil(KINOLAR.length / limit);
let bookmarks = localStorage.getItem('bookmarks')
    ? JSON.parse(localStorage.getItem('bookmarks')) : [];


let fragmentWrapper = document.createDocumentFragment()

let renderMovies = (arr) => {
    elWarapper.innerHTML = null;
    arr.forEach((movie) => {
        let elCard = elTemplate.cloneNode(true)
        let title = elCard.querySelector('.card-title');
        let categories = elCard.querySelector('.card-text');
        let img = elCard.querySelector('.card-img-top');
        let year = elCard.querySelector('.js-year');
        let rating = elCard.querySelector('.js-rating');

        let elBookmarkBtn = elCard.querySelector('.js-bookmark');
        let moreBtn = elCard.querySelector('.js-more');

        elBookmarkBtn.dataset.id = movie.imdbId;
        moreBtn.dataset.id = movie.imdbId;

        title.textContent = movie.title;
        categories.textContent = movie.categories;
        img.src = movie.bigPoster;
        img.height = "150";
        year.textContent = 'Year' + ' ' + movie.year;
        rating.textContent = 'Rating' + ' ' + movie.imdbRating + '⭐';


        fragmentWrapper.appendChild(elCard);
        elWarapper.appendChild(fragmentWrapper);
    });
};



let getMovieGenres = (array) => {
    let categories = [];
    array.forEach((item) => {
        item.categories.forEach(category => {
            if (!categories.includes(category)) {
                categories.push(category);
            }
        });
    });

    return categories;
};


let renderCategories = () => {
    let allCategories = getMovieGenres(KINOLAR);
    allCategories.forEach((category) => {
        let elOption = document.createElement('option');

        elOption.textContent = category;
        elOption.value = category;

        elSelect.appendChild(elOption);
    })
};

renderCategories()


let sortMovies = {
    az: (a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1;
        }
        else {
            return 1;
        }
    },

    za: (a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return 1;
        }
        else {
            return -1;
        }
    },

    hl: (a, b) => {
        if (a.imdbRating < b.imdbRating) {
            return 1;
        }
        else {
            return -1;
        }
    },

    lh: (a, b) => {
        if (a.imdbRating < b.imdbRating) {
            return -1;
        }
        else {
            return 1;
        }
    },

    on: (a, b) => {
        if (a.year < b.year) {
            return -1;
        }
        else {
            return 1;
        }
    },

    no: (a, b) => {
        if (a.year < b.year) {
            return 1;
        }
        else {
            return -1;
        }
    }
}


let handleFilter = (evt) => {
    evt.preventDefault();

    let filteredMovies = [];
    let selectValue = elSelect.value;
    let elSearchValue = elSearch.value.trim();
    let sort = elRatingSelect.value;

    let regex = new RegExp(elSearchValue, 'gi')

    if (selectValue === 'all') {
        filteredMovies = KINOLAR;
    }
    else {
        filteredMovies = KINOLAR.filter((movie) => movie.categories.includes(selectValue));
    }


    let foundMovies = filteredMovies.filter((movie) => movie.title.match(regex));

    foundMovies.sort(sortMovies[sort]);


    renderMovies(foundMovies);
};


elPageCounter.textContent = page;

let handleNextPage = () => {
    page += 1;

    if (page <= maxPageCounter) {
        elPageCounter.textContent = page;
        renderMovies(KINOLAR.slice(limit * (page - 1), limit * page))
    }

    if (page === maxPageCounter) {
        elNextBtn.disabled = true;
    }
    else {
        elPrevBtn.disabled = false;
    }
};

elPrevBtn.disabled = true;

let handlePrevPage = () => {
    page -= 1;

    if (page > 0) {
        elPageCounter.textContent = page;
        renderMovies(KINOLAR.slice(limit * (page - 1), limit * page))
    }
    if (page === 0) {
        elPrevBtn.disabled = true;
    } else {
        elNextBtn.disabled = false;
    }
}


let bookmarkFragment = document.createDocumentFragment();


let renderBookmarks = (arr) => {
    arr.forEach((bookmark) => {
        let bookmarkClone = elBookmarkTemplate.cloneNode(true);

        let bookmarkTitle = bookmarkClone.querySelector('.bookmark-title');
        let item = bookmarkClone.querySelector('.item');


        let modalRemoveBtn = bookmarkClone.querySelector('.modal-remove-btn');
        modalRemoveBtn.dataset.id = bookmark.imdbId;

        let handleRemove = (evt) => {
            console.log('remove');
            item.innerHTML = null;
        }

        modalRemoveBtn.addEventListener('click', handleRemove);

        bookmarkTitle.textContent = bookmark.title;
        bookmarkFragment.appendChild(bookmarkClone);
    });
    bookmarkList.innerHTML = null;
    bookmarkList.appendChild(bookmarkFragment);
}

let handleWrapper = (evt) => {
    if (evt.target.matches('.js-bookmark')) {
        const foundMovie = KINOLAR.find(
            (movie) => movie.imdbId === evt.target.dataset.id
        );

        let bookmarkMovie = bookmarks.find((bookmark) => bookmark.imdbId === evt.target.dataset.id);

        if (!bookmarkMovie) {
            bookmarks.push(foundMovie);
        }

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        renderBookmarks(bookmarks);
    }
    else if (evt.target.matches('.js-more')) {
        let foundMovie = KINOLAR.find((movie) => movie.imdbId === evt.target.dataset.id
        );

        modalTitle.textContent = foundMovie.title;
        modalSummary.textContent = foundMovie.summary;
        modalImg.src = foundMovie.smallPoster;
        modalImg.width = '270'
        modalImg.height = '170';
        modalLink.href = foundMovie.trailer;
    }
};


elWarapper.addEventListener('click', handleWrapper);
elPrevBtn.addEventListener('click', handlePrevPage);
elNextBtn.addEventListener('click', handleNextPage);
elForm.addEventListener('submit', handleFilter);
renderMovies(KINOLAR);
renderBookmarks(bookmarks);
