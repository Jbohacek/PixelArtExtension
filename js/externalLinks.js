async function loadItems() {

    var getLinkIcon = 'https://icons.duckduckgo.com/ip3/'
    var arguments = ''

    // Fetch the JSON file
    const response = await fetch('data/links.json');
    const data = await response.json();

    //http://www.google.com/s2/favicons?domain=is.czu.cz/auth/

    data.items.forEach(item => {
      var copyOfExample = document.getElementById('exampleLinkBox').cloneNode(true);
      copyOfExample.Id = "";
      copyOfExample.classList.remove('hidden');
      copyOfExample.innerText = item.name;
      copyOfExample.setAttribute('data-link',item.link);
      copyOfExample.addEventListener('click', navigateToUrl);
 
      const imgElement = document.createElement('img');
      imgElement.src = getLinkIcon + item.link.replace('https://', '') + '.ico';
      imgElement.setAttribute('data-link',item.link);

      document.getElementById('boxAdresses').appendChild(copyOfExample)
      copyOfExample.prepend(imgElement);
    })
    

}

function navigateToUrl(event) {

  // Get the button that triggered the event (the sender)
  const button = event.target;
  
  // Get the URL stored in the button's data-link attribute
  const url = button.getAttribute('data-link');

  // Replace the current website with the new URL
  window.location.href = url;
}

//https://icon.horse/icon/is.czu.cz/auth/
//http://www.google.com/s2/favicons?domain=is.czu.cz
//https://icons.duckduckgo.com/ip3/www.google.com.ico
//https://icons.duckduckgo.com/ip3/is.czu.cz.ico
//https://api.statvoo.com/favicon/google.com

loadItems();