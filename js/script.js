'use strict';

{
const optActiveClass = 'active';

const optSelectors = {
  article: '.post',
  articleTitle: '.post-title',
  activeArticle: '.post.' + optActiveClass,
  /*activeArticle: this.article + '.' + optActiveClass,
  Poproszę o wyjaśnienie, dlaczego powyższy wiersz nie działa. Ja to kiedyś rozumiałem, a teraz pustka w głowie*/
  titleList: '.titles',
  titleLinks: '.titles a',
  activeTitleLink: '.titles a.' + optActiveClass,
  firstTitleLink: 'li:first-of-type a'
}

const titleLinkTemplate = {
  firstPart: '<li><a href=\"#',
  thirdPart: '\"><span>',
  fifthPart: '</span></a></li>'
}


const titleClickHandler = function(e){
  e.preventDefault();
  const clickedElement = this;
  const newActiveArticleId = clickedElement.getAttribute('href');
  const activeLinks = document.querySelectorAll(optSelectors.activeTitleLink);
  for (let activeLink of activeLinks){
    activeLink.classList.remove(optActiveClass);
  }
  clickedElement.classList.add(optActiveClass)
  const activeArticles = document.querySelectorAll(optSelectors.activeArticle);
  for (let activeArticle of activeArticles){
    activeArticle.classList.remove(optActiveClass);
  }
  document.querySelector(newActiveArticleId).classList.add(optActiveClass)
}

const generateTitleLinks = function(selector){
  const titleList = document.querySelector(optSelectors.titleList);
  titleList.innerHTML = '';
  const listofArticles = document.querySelectorAll(selector);
  let newTitleListContent = '';
  for(let article of listofArticles){
    newTitleListContent += (titleLinkTemplate.firstPart + article.getAttribute('id') +
    titleLinkTemplate.thirdPart + article.querySelector(optSelectors.articleTitle).textContent +
    titleLinkTemplate.fifthPart);
  }
  titleList.innerHTML = newTitleListContent;
  titleList.querySelector(optSelectors.firstTitleLink).classList.add(optActiveClass);
  const links = document.querySelectorAll(optSelectors.titleLinks);
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks(optSelectors.article);
}
