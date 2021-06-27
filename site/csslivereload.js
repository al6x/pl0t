setInterval(function(){
  var links = document.querySelectorAll('head link')
  for(const link of links){
    if (link.getAttribute('rel') == 'icon') continue
    var href = link.getAttribute('href').split('#')[0]
    link.setAttribute('href', href + '#' + Math.random())
  }
}, 1000)