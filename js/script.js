'use strict';

const titleClickHandler = function(e){
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  const activeArticles = document.querySelectorAll('article.post.active');
  for (let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }  
}

const links = document.querySelectorAll('.titles a');

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}
