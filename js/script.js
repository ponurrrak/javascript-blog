'use strict';

const titleClickHandler = function(e){
  console.log('Link was clicked!');
  console.log(e);
}

const links = document.querySelectorAll('.titles a');

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}
