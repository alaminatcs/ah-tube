let ask = false;
let contentsContainer = [];

const addRedBG = (id) => {
    const btnsId = ['all', 'music', 'comedy', 'drawing'];
    for (const btnId of btnsId) {
        if (btnId === id) {
            const element = document.getElementById(id);
            element.classList.add('bg-red-500');
        }
        else {
            const element = document.getElementById(btnId);
            element.classList.remove('bg-red-500');
        }
    }
}

const timeConversion = (sec) => {
    let secInt = parseInt(sec);
    const hours = parseInt(secInt / 3600);
    secInt = parseInt(secInt % 3600);
    const mins = parseInt(secInt / 60);
    return `${hours} hrs ${mins} min ago`;
}

const loadingSpinner = (order) => {
    if (!order) {
        document.getElementById('spinner').classList.add('hidden');
    }
    else {
        document.getElementById('spinner').classList.remove('hidden');
    }
}

const drawingContentDisplay = () => {  
    loadingSpinner(true);  
    const cardParent = document.getElementById('content-container');
    cardParent.classList.remove('md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
    cardParent.textContent = '';
    
    const cardChild = document.createElement('div');
    cardChild.innerHTML = `
    <div class="flex flex-col items-center text-center">
        <img class="mt-12 w-32 h-32" src="images/icon.png" alt="no content logo">
        <p class="text-2xl font-semibold">Oops!! Sorry, There is no content here</p>
    </div>
    `
    cardParent.appendChild(cardChild);
    loadingSpinner(false);
}

const displayContent = () => {
    loadingSpinner(true);
    const cardParent = document.getElementById('content-container');
    cardParent.textContent = '';
    cardParent.classList.add('md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');

    if (ask) {
        contentsContainer.sort((a, b) => b.others.views - a.others.views);
    }

    contentsContainer.forEach(content => {
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
    loadingSpinner(false);
}

const loadContent = async (contentId = 1000, id = 'all') => {
    addRedBG(id);
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${contentId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        contentsContainer = jsonData.data;
        id === 'drawing' ? drawingContentDisplay() : displayContent();
    }
    catch(error) {
        console.error('Error fetching content:', error);
    }
}

document.getElementById('sort-btn').addEventListener('click', () => {
    // Sort content by views (descending order)
    const element = document.getElementById('sort-btn');
    if (element.classList.contains('bg-red-500')) {
        ask = false;
        element.classList.remove('bg-red-500');
    }
    else {
        ask = true;
        element.classList.add('bg-red-500');
    }
});

loadContent();