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

const getNewsByCategory = category => {
  if (category === 'nz') {
    getNews('', 'nz', '');
  } else if (category === 'stuff.co.nz') {
    getNews('', '', 'stuff.co.nz');
  } else if (category === 'bbc-news') {
    getNews('bbc-news', '', '');
  } else if (category === 'wsj.com,nytimes.com') {
    getNews('', '', 'wsj.com,nytimes.com');
  } else if (category === 'kr') {
    getNews('', 'kr', '');
  }
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
      console.log(json);

      textHTML = "<div class='articles-container'>";

      json.articles.forEach(article => {
        console.log(article.title);

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
      console.log(textHTML);

      const articlesFrame = document.querySelector('.articles-frame');
      console.log(articlesFrame);
      articlesFrame.innerHTML = textHTML;
    });
};

readNewsBySavedCategory();
