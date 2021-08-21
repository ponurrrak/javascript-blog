'use strict';

{
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
    articleTagTemplate: function(tag){
      return `<li><a href="#tag-${tag}">${tag}</a></li>`;
    },
    cloudTagsLastLink: 'li:last-of-type a'
  };

  optSelectors.activeArticle = optSelectors.article + '.' + optClassesConfig.activeClassName;
  optSelectors.titleLinks = optSelectors.titleList + ' a';
  optSelectors.activeTitleLink = optSelectors.titleLinks + '.' + optClassesConfig.activeClassName;
  optSelectors.activeTagLink = optSelectors.tagLink + '.' + optClassesConfig.activeClassName;
  optSelectors.activeArticleAuthor = optSelectors.articleAuthor + ' .' + optClassesConfig.activeClassName;

  const substringsToRemoveLength = {
    inTagLink: '#tag-'.length,
    inTitleLink: '#'.length,
    inAuthorLink: '#author-'.length
  };

  const fullListofArticles = document.querySelectorAll(optSelectors.article);

  const titleClickHandler = function(e){
    e.preventDefault();
    const clickedElement = this;
    const newActiveArticleId = clickedElement.getAttribute('href');
    const activeLinks = document.querySelectorAll(optSelectors.activeTitleLink);
    for(let activeLink of activeLinks){
      activeLink.classList.remove(optClassesConfig.activeClassName);
    }
    clickedElement.classList.add(optClassesConfig.activeClassName);
    const activeArticles = document.querySelectorAll(optSelectors.activeArticle);
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove(optClassesConfig.activeClassName);
    }
    document.querySelector(newActiveArticleId).classList.add(optClassesConfig.activeClassName);
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
    for(let tag in uniqueTagsCounter){
      tagsCloudListWrapper.insertAdjacentHTML('beforeend', optSelectors.articleTagTemplate(tag));
      tagsCloudListWrapper.querySelector(optSelectors.cloudTagsLastLink).classList.add(calculateTagClass(uniqueTagsCounter[tag], tagsParams));
    }
  };

  const generateTags = function(){
    const uniqueTagsCounter = {};
    for(let article of fullListofArticles){
      const articleTagsList = article.querySelector(optSelectors.articleTags);
      let articleTagsListContent = '';
      const tags = article.getAttribute('data-tags').split(' ');
      for(let tag of tags){
        articleTagsListContent += optSelectors.articleTagTemplate(tag);
        if(!uniqueTagsCounter[tag]){
          uniqueTagsCounter[tag] = 1;
        } else {
          uniqueTagsCounter[tag]++;
        }
      }
      articleTagsList.innerHTML = articleTagsListContent;
    }
    generateTagsCloud(uniqueTagsCounter);
  };

  const tagClickHandler = function(e){
    e.preventDefault();
    const clickedElement = this;
    const newActiveTagLink = clickedElement.getAttribute('href');
    const newActiveTagText =  newActiveTagLink.slice(substringsToRemoveLength.inTagLink);
    const activeTagLinks = document.querySelectorAll(optSelectors.activeTagLink);
    for(let activeTagLink of activeTagLinks){
      activeTagLink.classList.remove(optClassesConfig.activeClassName);
    }
    const newActiveTags = document.querySelectorAll(optSelectors.linkTemplate(newActiveTagLink));
    for(let newActiveTag of newActiveTags){
      newActiveTag.classList.add(optClassesConfig.activeClassName);
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
    const newActiveAuthorText =  newActiveAuthorLink.slice(substringsToRemoveLength.inAuthorLink);
    const activeAuthorLinks = document.querySelectorAll(optSelectors.activeArticleAuthor);
    for(let activeAuthorLink of activeAuthorLinks){
      activeAuthorLink.classList.remove(optClassesConfig.activeClassName);
    }
    const newActiveAuthors = document.querySelectorAll(optSelectors.linkTemplate(newActiveAuthorLink));
    for(let newActiveAuthor of newActiveAuthors){
      newActiveAuthor.classList.add(optClassesConfig.activeClassName);
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
