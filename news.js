String.prototype.trunc = function(n) {
  return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
};

const saveCategory = category => {
  localStorage.setItem('newsCategory', category);
};

const readNewsBySavedCategory = () => {
  let savedCatgory = localStorage.getItem('newsCategory');
  if (savedCatgory === null || savedCatgory === '') {
    savedCatgory = 'nz';
  }
  getNewsByCategory(savedCatgory);
};

const selectButton = category => {
  document.querySelector('.category-nz').classList.remove('selected');
  document.querySelector('.category-stuff').classList.remove('selected');
  document.querySelector('.category-bbc').classList.remove('selected');
  document.querySelector('.category-us').classList.remove('selected');
  document.querySelector('.category-kr').classList.remove('selected');

  if (category === 'nz') {
    document.querySelector('.category-nz').classList.add('selected');
  } else if (category === 'stuff.co.nz') {
    document.querySelector('.category-stuff').classList.add('selected');
  } else if (category === 'bbc-news') {
    document.querySelector('.category-bbc').classList.add('selected');
  } else if (category === 'wsj.com,nytimes.com') {
    document.querySelector('.category-us').classList.add('selected');
  } else if (category === 'kr') {
    document.querySelector('.category-kr').classList.add('selected');
  }
};

const getNewsByCategory = category => {
  if (category === 'nz') {
    getNews('', 'nz', '');
    document.querySelector('.category-nz').classList.add('selected');
  } else if (category === 'stuff.co.nz') {
    getNews('', '', 'stuff.co.nz');
    document.querySelector('.category-stuff').classList.add('selected');
  } else if (category === 'bbc-news') {
    getNews('bbc-news', '', '');
    document.querySelector('.category-bbc').classList.add('selected');
  } else if (category === 'wsj.com,nytimes.com') {
    getNews('', '', 'wsj.com,nytimes.com');
    document.querySelector('.category-us').classList.add('selected');
  } else if (category === 'kr') {
    getNews('', 'kr', '');
    document.querySelector('.category-kr').classList.add('selected');
  }
  selectButton(category);
};

const getNews = (sources, country, domains) => {
  let url = `https://newsapi.org/v2/top-headlines?sources=${sources}&country=${country}&apiKey=dbd63c6023db48bcb79a14e20d25e360`;
  if (domains && domains !== '') {
    url = `https://newsapi.org/v2/everything?domains=${domains}&apiKey=dbd63c6023db48bcb79a14e20d25e360`;
  }

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      textHTML = "<div class='articles-container'>";

      json.articles.forEach(article => {
        //console.log(article.title);

        textHTML += `<article class='card'>
                <img src="${
                  article.urlToImage ? article.urlToImage : './images/alt.jpg'
                }"  alt=""/>
                <div>

                <a href="${article.url}" target="_target">
                    <p class='article-title'>${article.title}</p>
                </a>
                    <p class='article-description'>${article.description}</p>
                </div>
            </article>`;
        //console.log(article.title, article.description);
      });
      textHTML += '</div>';
      //console.log(textHTML);

      const articlesFrame = document.querySelector('.articles-frame');
      //console.log(articlesFrame);
      articlesFrame.innerHTML = textHTML;
    });
};

readNewsBySavedCategory();
