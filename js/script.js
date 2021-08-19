'use strict';

{
  const optTitleLinkTemplate = '<li><a href="#{article-id}"><span>{article-title}</span></a></li>';
  // {article-id} and {article-title} in string above are placeholders only to be replaced in further code by values of variables

  const optTagWrapperTemplate = '<li><a href="#tag-{tag}">{tag}</a></li>';
  // same idea as above. It's also implemented below in other variables or properties with names based on word "template"

  const optArticleAuthorTemplate = '<a href="#author-{author}">by {author}</a>';

  const optActiveClass = 'active';

  const optSelectors = {
    article: '.post',
    articleTitle: '.post-title',
    titleList: '.titles',
    articleTags: '.post-tags .list',
    tagLink: 'a[href^="#tag-"]',
    articleAuthor: '.post-author',
    authorLink: 'a[href^="#author-"]',
    linkTemplate: 'a[href="{link}"]'
  };

  optSelectors.activeArticle = optSelectors.article + '.' + optActiveClass;
  optSelectors.titleLinks = optSelectors.titleList + ' a';
  optSelectors.activeTitleLink = optSelectors.titleLinks + '.' + optActiveClass;
  optSelectors.activeTagLink = optSelectors.tagLink + '.' + optActiveClass;
  optSelectors.articleTagggedTemplate = optSelectors.article + '[data-tags~="{tagText}"]';
  optSelectors.activeArticleAuthor = optSelectors.articleAuthor + ' .' + optActiveClass;
  optSelectors.articleBySameAuthorTemplate = optSelectors.article + '[data-author="{authorText}"]';

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
    const listofArticles = (selector !== undefined) ? document.querySelectorAll(selector) : fullListofArticles;
    for(let article of listofArticles){
      newTitleListContent += optTitleLinkTemplate.replace('{article-id}', article.getAttribute('id')).replace('{article-title}', article.querySelector(optSelectors.articleTitle).textContent);
    }
    titleList.innerHTML = newTitleListContent;
    const links = document.querySelectorAll(optSelectors.titleLinks);
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
      for(let activeArticle of document.querySelectorAll(optSelectors.activeArticle)){
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
      for(let tag of article.getAttribute('data-tags').split(' ')){
        articleTagsListContent += optTagWrapperTemplate.replace(/\{tag\}/g, tag);
      }
      articleTagsList.innerHTML = articleTagsListContent;
    }
  };

  const tagClickHandler = function(e){
    e.preventDefault();
    const clickedElement = this;
    const newActiveTagLink = clickedElement.getAttribute('href');
    const newActiveTagText =  newActiveTagLink.slice(5);
    for(let activeTagLink of document.querySelectorAll(optSelectors.activeTagLink)){
      activeTagLink.classList.remove(optActiveClass);
    }
    for(let newActiveTag of document.querySelectorAll(optSelectors.linkTemplate.replace('{link}', newActiveTagLink))){
      newActiveTag.classList.add(optActiveClass);
    }
    generateTitleLinks(optSelectors.articleTagggedTemplate.replace(/\{tagText\}/g, newActiveTagText));
  };

  const addClickListenersToTags = function(){
    for(let tagLink of document.querySelectorAll(optSelectors.tagLink)){
      tagLink.addEventListener('click', tagClickHandler);
    }
  };

  const generateAuthors = function(){
    for(let article of fullListofArticles){
      article.querySelector(optSelectors.articleAuthor).innerHTML = optArticleAuthorTemplate.replace(/\{author\}/g, article.getAttribute('data-author'));
    }
  };

  const authorClickHandler = function(e){
    e.preventDefault();
    const clickedElement = this;
    const newActiveAuthorLink = clickedElement.getAttribute('href');
    const newActiveAuthorText =  newActiveAuthorLink.slice(8);
    for(let activeAuthorLink of document.querySelectorAll(optSelectors.activeArticleAuthor)){
      activeAuthorLink.classList.remove(optActiveClass);
    }
    for(let newActiveAuthor of document.querySelectorAll(optSelectors.linkTemplate.replace('{link}', newActiveAuthorLink))){
      newActiveAuthor.classList.add(optActiveClass);
    }
    generateTitleLinks(optSelectors.articleBySameAuthorTemplate.replace(/\{authorText\}/g, newActiveAuthorText));
  };

  const addClickListenersToAuthors = function(){
    for(let authorLink of document.querySelectorAll(optSelectors.authorLink)){
      authorLink.addEventListener('click', authorClickHandler);
    }
  };

  generateTitleLinks();

  generateTags();

  addClickListenersToTags();

  generateAuthors();

  addClickListenersToAuthors();
}
