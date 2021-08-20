'use strict';

{
  const optActiveClass = 'active';

  const optSelectors = {
    article: '.post',
    articleTitle: '.post-title',
    titleList: '.titles',
    articleTags: '.post-tags .list',
    tagLink: 'a[href^="#tag-"]',
    articleAuthor: '.post-author',
    authorLink: 'a[href^="#author-"]',
    linkTemplate: function(link){
      return `a[href="${link}"]`;
    }
  };

  optSelectors.activeArticle = optSelectors.article + '.' + optActiveClass;
  optSelectors.titleLinks = optSelectors.titleList + ' a';
  optSelectors.activeTitleLink = optSelectors.titleLinks + '.' + optActiveClass;
  optSelectors.activeTagLink = optSelectors.tagLink + '.' + optActiveClass;
  optSelectors.activeArticleAuthor = optSelectors.articleAuthor + ' .' + optActiveClass;

  const fullListofArticles = document.querySelectorAll(optSelectors.article);

  const titleClickHandler = function(e){
    e.preventDefault();
    const clickedElement = this;
    const newActiveArticleId = clickedElement.getAttribute('href');
    const activeLinks = document.querySelectorAll(optSelectors.activeTitleLink);
    for(let activeLink of activeLinks){
      activeLink.classList.remove(optActiveClass);
    }
    clickedElement.classList.add(optActiveClass);
    const activeArticles = document.querySelectorAll(optSelectors.activeArticle);
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove(optActiveClass);
    }
    document.querySelector(newActiveArticleId).classList.add(optActiveClass);
  };

  const generateTitleLinks = function(selector){
    const titleList = document.querySelector(optSelectors.titleList);
    titleList.innerHTML = '';
    let newTitleListContent = '';
    const listofArticles = selector ? document.querySelectorAll(selector) : fullListofArticles;
    for(let article of listofArticles){
      newTitleListContent += `<li><a href="#${article.getAttribute('id')}"><span>${article.querySelector(optSelectors.articleTitle).textContent}</span></a></li>`;
    }
    titleList.innerHTML = newTitleListContent;
    const links = document.querySelectorAll(optSelectors.titleLinks);
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
      const activeArticles = document.querySelectorAll(optSelectors.activeArticle);
      for(let activeArticle of activeArticles){
        if(link.getAttribute('href').slice(1) === activeArticle.getAttribute('id')){
          link.classList.add(optActiveClass);
        }
      }
    }
  };

  const generateTags = function(){
    for(let article of fullListofArticles){
      const articleTagsList = article.querySelector(optSelectors.articleTags);
      let articleTagsListContent = '';
      const tags = article.getAttribute('data-tags').split(' ');
      for(let tag of tags){
        articleTagsListContent += `<li><a href="#tag-${tag}">${tag}</a></li>`;
      }
      articleTagsList.innerHTML = articleTagsListContent;
    }
  };

  const tagClickHandler = function(e){
    e.preventDefault();
    const clickedElement = this;
    const newActiveTagLink = clickedElement.getAttribute('href');
    const newActiveTagText =  newActiveTagLink.slice(5);
    const activeTagLinks = document.querySelectorAll(optSelectors.activeTagLink);
    for(let activeTagLink of activeTagLinks){
      activeTagLink.classList.remove(optActiveClass);
    }
    const newActiveTags = document.querySelectorAll(optSelectors.linkTemplate(newActiveTagLink));
    for(let newActiveTag of newActiveTags){
      newActiveTag.classList.add(optActiveClass);
    }
    generateTitleLinks(`${optSelectors.article}[data-tags~="${newActiveTagText}"]`);
  };

  const addClickListenersToTags = function(){
    const tagLinks = document.querySelectorAll(optSelectors.tagLink);
    for(let tagLink of tagLinks){
      tagLink.addEventListener('click', tagClickHandler);
    }
  };

  const generateAuthors = function(){
    for(let article of fullListofArticles){
      article.querySelector(optSelectors.articleAuthor).innerHTML = `<a href="#author-${article.getAttribute('data-author')}">by ${article.getAttribute('data-author')}</a>`;
    }
  };

  const authorClickHandler = function(e){
    e.preventDefault();
    const clickedElement = this;
    const newActiveAuthorLink = clickedElement.getAttribute('href');
    const newActiveAuthorText =  newActiveAuthorLink.slice(8);
    const activeAuthorLinks = document.querySelectorAll(optSelectors.activeArticleAuthor);
    for(let activeAuthorLink of activeAuthorLinks){
      activeAuthorLink.classList.remove(optActiveClass);
    }
    const newActiveAuthors = document.querySelectorAll(optSelectors.linkTemplate(newActiveAuthorLink));
    for(let newActiveAuthor of newActiveAuthors){
      newActiveAuthor.classList.add(optActiveClass);
    }
    generateTitleLinks(`${optSelectors.article}[data-author="${newActiveAuthorText}"]`);
  };

  const addClickListenersToAuthors = function(){
    const authorLinks = document.querySelectorAll(optSelectors.authorLink);
    for(let authorLink of authorLinks){
      authorLink.addEventListener('click', authorClickHandler);
    }
  };

  generateTitleLinks();

  generateTags();

  addClickListenersToTags();

  generateAuthors();

  addClickListenersToAuthors();
}
