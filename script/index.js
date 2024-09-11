const loadContent = async (contentId = 1000, ask) => {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${contentId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        const contents = jsonData.data;
        displayContent(contents);
    }
    catch(error) {
        console.error('Error fetching content:', error);
    }
}

const timeConversion = (sec) => {
    let secInt = parseInt(sec);
    const hours = parseInt(secInt / 3600);
    secInt = parseInt(secInt % 3600);
    const mins = parseInt(secInt / 60);
    return `${hours} hrs ${mins} min ago`;
}

const displayContent = (contents) => {
    const cardParent = document.getElementById('content-container');
    cardParent.textContent = '';
    contents.forEach(content => {
        const cardChild = document.createElement('div');
        cardChild.classList = `card bg-base-100 shadow-lg`;
        cardChild.innerHTML = `
        <figure class="relative w-full h-64">
            <img class="w-full h-full object-cover" src="${content.thumbnail}" alt="content picture" />
            ${content.others.posted_date ? `
                <div class="absolute bottom-2 right-2 bg-black text-white px-2 py-1 text-sm rounded">
                    ${timeConversion(content.others.posted_date)}
                </div>
            ` : ''}
        </figure>
        <div class="flex pt-4">
            <div class="w-16 h-16">
                <img class="w-full h-full object-cover rounded-full" src="${content.authors[0].profile_picture}" alt="author picture">
            </div>
            <div class="ml-3">
                <p class="text-2xl font-semibold">${content.title}</p>
                <p class="flex items-center font-serif">
                    ${content.authors[0].profile_name}
                    ${content.authors[0].verified ? `<img class="h-4 w-4 ml-2" src="images/verified.png" alt="verified icon">` : ''}
                </p>
                <p>${content.others.views} views</p>
            </div>
        </div>
        `
        cardParent.appendChild(cardChild);
    });
}

document.getElementById('All').addEventListener('click', () => {
    loadContent(1000);
});

document.getElementById('Music').addEventListener('click', () => {
    loadContent(1001);
});

document.getElementById('Comedy').addEventListener('click', () => {
    loadContent(1002);
});

document.getElementById('Drawing').addEventListener('click', () => {
    loadContent(1003);
});

loadContent();