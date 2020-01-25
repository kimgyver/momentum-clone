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

  const preventImage = localStorage.getItem('prevent-image') === 'true';
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      textHTML = "<div class='articles-container'>";
      json.articles.forEach(article => {
        textHTML += "<article class='card'>";

        if (localStorage.getItem('prevent-image') !== 'true') {
          textHTML += `<img src="${
            article.urlToImage ? article.urlToImage : './images/alt.jpg'
          }"  alt=""/>`;
        }
        textHTML += '<div>';
        textHTML += `<a href="${article.url}" target="_target">
                    <p class='article-title'>${article.title}</p>
                </a>
                    <p class='article-description'>${article.description}</p>
                </div>
            </article>`;
      });
      textHTML += '</div>';

      const articlesFrame = document.querySelector('.articles-frame');
      articlesFrame.innerHTML = textHTML;
    });
};

const initializePreventImageCheckbox = () => {
  const checkbox = document.querySelector('#image-prevent');
  checkbox.addEventListener('click', () => {
    localStorage.setItem('prevent-image', checkbox.checked);
  });

  console.log('initial value:', localStorage.getItem('prevent-image'));
  checkbox.checked = localStorage.getItem('prevent-image') === 'true';
};

readNewsBySavedCategory();
initializePreventImageCheckbox();
