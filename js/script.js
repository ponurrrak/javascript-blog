'use strict';

{
const optActiveClass = 'active';

const optSelectors = {
  article: '.post',
  articleTitle: '.post-title',
  titleList: '.titles',
  firstTitleLink: 'li:first-of-type a'
}

optSelectors.activeArticle = optSelectors.article + '.' + optActiveClass;
optSelectors.titleLinks = optSelectors.titleList + ' a';
optSelectors.activeTitleLink = optSelectors.titleLinks + '.' + optActiveClass;

const optTitleLinkTemplate = '<li><a href=\"#{article-id}\"><span>{article-title}</span></a></li>'
// {article-id} and {article-title} in string above are placeholders only to be replaced in further code by values of variables


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
    newTitleListContent += optTitleLinkTemplate.replace('{article-id}', article.getAttribute('id'))
    .replace('{article-title}', article.querySelector(optSelectors.articleTitle).textContent);
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
