'use strict';

{
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorsListLink: Handlebars.compile(document.querySelector('#template-authors-list-link').innerHTML),
  };

  const optClassesConfig = {
    activeClassName: 'active',
    cloudClassCount: 5,
    cloudClassPrefix: 'tag-size-'
  };

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
    },
    tagsCloudListWrapper: '.list.tags',
    cloudTagsLastLink: 'li:last-of-type a',
    authorsListWrapper: '.list.authors'
  };

  optSelectors.activeArticle = optSelectors.article + '.' + optClassesConfig.activeClassName;
  optSelectors.titleLink = optSelectors.titleList + ' a';  

  const substringsToRemoveLength = {
    inTagLink: '#tag-'.length,
    inTitleLink: '#'.length,
    inAuthorLink: '#author-'.length
  };

  const fullListofArticles = document.querySelectorAll(optSelectors.article);

  const removeActiveClass = function(...selectors){
    selectors = selectors.join(`.${optClassesConfig.activeClassName}, `) + '.' + optClassesConfig.activeClassName;
    const activeLinks = document.querySelectorAll(selectors);
    for(let activeLink of activeLinks){
      activeLink.classList.remove(optClassesConfig.activeClassName);
    }
  };

  const addActiveClass = function(selector){    
    const newActiveLinks = document.querySelectorAll(selector);
    for(let newActiveLink of newActiveLinks){
      newActiveLink.classList.add(optClassesConfig.activeClassName);
    }
  };

  const titleClickHandler = function(e){
    e.preventDefault();
    const clickedElement = this;
    const newActiveArticleId = clickedElement.getAttribute('href');
    removeActiveClass(optSelectors.titleLink, optSelectors.article);
    clickedElement.classList.add(optClassesConfig.activeClassName);
    addActiveClass(newActiveArticleId);
  };

  const generateTitleLinks = function(selector){
    const titleList = document.querySelector(optSelectors.titleList);
    titleList.innerHTML = '';
    let newTitleListContent = '';
    const listofArticles = selector ? document.querySelectorAll(selector) : fullListofArticles;
    for(let article of listofArticles){
      newTitleListContent += templates.articleLink({
        id: article.getAttribute('id'),
        title: article.querySelector(optSelectors.articleTitle).textContent
      });
    }
    titleList.innerHTML = newTitleListContent;
    const links = document.querySelectorAll(optSelectors.titleLink);
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
      const activeArticles = document.querySelectorAll(optSelectors.activeArticle);
      for(let activeArticle of activeArticles){
        if(link.getAttribute('href').slice(substringsToRemoveLength.inTitleLink) === activeArticle.getAttribute('id')){
          link.classList.add(optClassesConfig.activeClassName);
        }
      }
    }
  };

  const calculateTagsParams = function(tags){
    const tagsPopularityList = Object.values(tags);
    return {
      max: Math.max(...tagsPopularityList),
      min: Math.min(...tagsPopularityList),
    };
  };

  const calculateTagClass = function(count, params){
    const classNum = Math.floor((count - params.min) / (params.max - params.min) * (optClassesConfig.cloudClassCount - 1) +1);
    return optClassesConfig.cloudClassPrefix + classNum;
  };

  const generateTagsCloud = function(uniqueTagsCounter){
    const tagsParams = calculateTagsParams(uniqueTagsCounter);
    const tagsCloudListWrapper = document.querySelector(optSelectors.tagsCloudListWrapper);
    const tagsData = {tags: []};
    for(let tag in uniqueTagsCounter){
      tagsData.tags.push({
        tag,
        class: calculateTagClass(uniqueTagsCounter[tag], tagsParams)
      });
    }
    tagsCloudListWrapper.innerHTML = templates.tagLink(tagsData);
  };

  const generateTags = function(){
    const uniqueTagsCounter = {};
    for(let article of fullListofArticles){
      const articleTagsList = article.querySelector(optSelectors.articleTags);
      const articleTagsListContent = {tags: []};
      const tags = article.getAttribute('data-tags').split(' ');
      for(let tag of tags){
        articleTagsListContent.tags.push({tag: tag, class: ''});
        if(!uniqueTagsCounter[tag]){
          uniqueTagsCounter[tag] = 1;
        } else {
          uniqueTagsCounter[tag]++;
        }
      }
      articleTagsList.innerHTML = templates.tagLink(articleTagsListContent);
    }
    generateTagsCloud(uniqueTagsCounter);
  };

  const tagClickHandler = function(e){
    e.preventDefault();
    const clickedElement = this;
    const newActiveTagLink = clickedElement.getAttribute('href');
    const newActiveTagText =  newActiveTagLink.slice(substringsToRemoveLength.inTagLink);
    removeActiveClass(optSelectors.tagLink, optSelectors.authorLink);
    addActiveClass(optSelectors.linkTemplate(newActiveTagLink));
    generateTitleLinks(`${optSelectors.article}[data-tags~="${newActiveTagText}"]`);
  };

  const addClickListenersToTags = function(){
    const tagLinks = document.querySelectorAll(optSelectors.tagLink);
    for(let tagLink of tagLinks){
      tagLink.addEventListener('click', tagClickHandler);
    }
  };

  const generateAuthorsList = function(articlesPerAuthor){
    const authorsListWrapper = document.querySelector(optSelectors.authorsListWrapper);
    const authorsData = {authors: []};
    for(let author in articlesPerAuthor){
      authorsData.authors.push({
        author,
        count: articlesPerAuthor[author]
      });
    }
    authorsListWrapper.innerHTML = templates.authorsListLink(authorsData);
  };

  const generateAuthors = function(){
    const articlesPerAuthor = {};
    for(let article of fullListofArticles){
      const author = article.getAttribute('data-author');
      article.querySelector(optSelectors.articleAuthor).innerHTML = templates.authorLink({author});
      if(!articlesPerAuthor[author]){
        articlesPerAuthor[author] = 1;
      } else {
        articlesPerAuthor[author]++;
      }
    }
    generateAuthorsList(articlesPerAuthor);
  };

  const authorClickHandler = function(e){
    e.preventDefault();
    const clickedElement = this;
    const newActiveAuthorLink = clickedElement.getAttribute('href');
    const newActiveAuthorText =  newActiveAuthorLink.slice(substringsToRemoveLength.inAuthorLink);
    removeActiveClass(optSelectors.authorLink, optSelectors.tagLink);
    addActiveClass(optSelectors.linkTemplate(newActiveAuthorLink));
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
