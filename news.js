String.prototype.trunc = function (n) {
  return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
};

const saveCategory = (category) => {
  localStorage.setItem('newsCategory', category);
};

const readNewsBySavedCategory = () => {
  let savedCatgory = localStorage.getItem('newsCategory');
  if (savedCatgory === null || savedCatgory === '') {
    savedCatgory = 'nz';
  }
  getNewsByCategory(savedCatgory);
};

const selectButton = (category) => {
  document.querySelector('.category-nz').classList.remove('selected');
  document.querySelector('.category-stuff').classList.remove('selected');
  document.querySelector('.category-bbc').classList.remove('selected');
  document.querySelector('.category-us').classList.remove('selected');
  document.querySelector('.category-kr').classList.remove('selected');
  document.querySelector('.category-in').classList.remove('selected');

  if (category === 'nz') {
    document.querySelector('.category-nz').classList.add('selected');
  } else if (category === 'stuff.co.nz') {
    document.querySelector('.category-stuff').classList.add('selected');
  } else if (category === 'bbc-news') {
    document.querySelector('.category-bbc').classList.add('selected');
  } else if (category === 'us') {
    document.querySelector('.category-us').classList.add('selected');
  } else if (category === 'kr') {
    document.querySelector('.category-kr').classList.add('selected');
  } else if (category === 'in') {
    document.querySelector('.category-in').classList.add('selected');
  }
};

const getNewsByCategory = (category) => {
  if (category === 'nz') {
    getNews('', 'nz', '');
    document.querySelector('.category-nz').classList.add('selected');
  } else if (category === 'stuff.co.nz') {
    getNews('', '', 'stuff.co.nz');
    document.querySelector('.category-stuff').classList.add('selected');
  } else if (category === 'bbc-news') {
    getNews('bbc-news', '', '');
    document.querySelector('.category-bbc').classList.add('selected');
  } else if (category === 'us') {
    getNews('', 'us', '');
    document.querySelector('.category-us').classList.add('selected');
  } else if (category === 'kr') {
    getNews('', 'kr', '');
    document.querySelector('.category-kr').classList.add('selected');
  } else if (category === 'in') {
    getNews('', 'in', '');
    document.querySelector('.category-in').classList.add('selected');
  }
  selectButton(category);
};

const getNews = (sources, country, domains) => {
  const articleContainer = document.querySelector('.articles-container');
  if (articleContainer) {
    articleContainer.classList.add('overlay');
    articleContainer.classList.add('loading');
  }

  let url = `https://newsapi.org/v2/top-headlines?sources=${sources}&country=${country}&apiKey=dbd63c6023db48bcb79a14e20d25e360`;
  if (domains && domains !== '') {
    url = `https://newsapi.org/v2/everything?domains=${domains}&apiKey=dbd63c6023db48bcb79a14e20d25e360`;
  }

  const preventImage = localStorage.getItem('prevent-image') === 'true';
  //fetch(url)
  const clientRequest = { url: url };
  fetch('https://request-proxy-jason.herokuapp.com/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientRequest),
  })
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (json) {
      console.log(json);
      textHTML = "<div class='articles-container overlay loading'>";
      //json.articles.forEach(article => {
      json.forEach((article) => {
        textHTML += "<article class='card'>";

        if (localStorage.getItem('prevent-image') !== 'true') {
          textHTML += `<a href="${article.url}" target="_target">
                        <img src="${
                          article.urlToImage
                            ? article.urlToImage
                            : './images/alt.jpg'
                        }"  alt=""/>
                       </a>`;
        }
        textHTML += '  <div>';
        textHTML += `  <a href="${article.url}" target="_target">
                         <p class='article-title'>${article.title}</p>
                       </a>
                      <p class='article-description'>${
                        article.description &&
                        (article.description.indexOf('����') !== -1
                          ? 'Description of this article has errors.<br> Read the article by click.'
                          : article.description)
                      }</p>
                    </div>
                  </article>`;
      });
      textHTML += '</div>';

      const articlesFrame = document.querySelector('.articles-frame');
      articlesFrame.innerHTML = textHTML;

      setTimeout(() => {
        const articleContainer = document.querySelector('.articles-container');
        if (articleContainer) {
          articleContainer.classList.remove('overlay');
          articleContainer.classList.remove('loading');
        }
      }, 1000);
    });
};

readNewsBySavedCategory();

setInterval(function () {
  if (localStorage.getItem('auto-refresh') === 'true') {
    readNewsBySavedCategory();
  }
}, 1200000);
