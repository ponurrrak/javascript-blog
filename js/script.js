'use strict';

const titleClickHandler = function(e){
  e.preventDefault();
  const clickedElement = this;
  const newActiveArticleId = clickedElement.getAttribute('href');
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active')
  const activeArticles = document.querySelectorAll('article.post.active');
  for (let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  document.querySelector(newActiveArticleId).classList.add('active')
}

const links = document.querySelectorAll('.titles a');

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}
