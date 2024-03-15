document.addEventListener("DOMContentLoaded", function () {
    defineBrowserForDownloadingArrow();

    const itemsContainer = document.getElementById('items-container');

    fetch('https://veryfast.io/t/front_test_api.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const dataResult = data.result.elements;
            if (dataResult && dataResult.length > 0) {
                dataResult.forEach(item => {
                    const {amount, license_name, name_prod, price_key, is_best, link} = item;
                    const priceTime = getPriceTime(license_name);
                    const fullPriceWithoutDiscount = calculatePrice(amount, price_key);
                    const price = isDiscounted(price_key) ? `${fullPriceWithoutDiscount}` : '';
                    const discountedHtml = isDiscounted(price_key) ? `<strike class="discounted-price fontRoboto">$${price}</strike>` : '';
                    const discountImgClass = isDiscounted(price_key) ? 'discount-img' : '';

                    const itemHtml = `
                    <div class="product-plan__item">
                        <div class="product-plan__price fontBebasNeue ${discountImgClass}">
                         ${is_best ? '<span class="best-value fontRoboto">Best Value</span>' : ''}
                            <h3>${amount}<span class="fontWeightBold">/${priceTime}</span>${discountedHtml}</h3>
                         </div>
                    <div class="product-plan__content">
                        <div class="product-plan__name fontRoboto">
                            <h2>${name_prod}</h2>
                            <b>${license_name}</b>
                        </div>

                    <div class="blockCenter">
                        <a href="${link}" download id="download-btn" class="product-plan__button fontRoboto">
                            download
                        </a>
                    </div>
                        </div>
                    </div>
                        `;
                    itemsContainer.insertAdjacentHTML('beforeend', itemHtml);

                });

                itemsContainer.addEventListener('click', function (event) {
                    if (event.target.id === 'download-btn') {
                        setTimeout(showDownloadInfo, 1500);
                    }
                });
            } else {
                itemsContainer.innerHTML = 'No items found.';
            }
        })
        .catch(error => {
            itemsContainer.innerHTML = 'An error occurred while fetching data.';
        });

});

function showDownloadInfo() {
    const downloadInfo = document.getElementById('downloadInfo');
    downloadInfo.classList.add('active');
    downloadInfo.classList.remove('hidden');
}

function getPriceTime(planName) {
    const planNameLower = planName.toLowerCase();
    if (/monthly/g.test(planNameLower)) {
        return 'mo';
    }
    if (/year/g.test(planNameLower)) {
        return 'per year';
    }
}

function calculatePrice(amount, price_key) {
    if (price_key.includes('%')) {
        const percentage = parseFloat(price_key) / 100;
        const fullPrice = parseFloat(amount) / (1 - percentage);
        const roundedPrice = Math.ceil(fullPrice * 100) / 100;
        if (roundedPrice.toFixed(2) === '9.98') {
            return '9.99';
        }
        return roundedPrice.toFixed(2);
    }
    return amount;
}

function isDiscounted(price_key) {
    return price_key.includes('%');
}

function defineBrowserForDownloadingArrow() {
    setArrowPosition();
}

function setArrowClass(className) {
    const arrowUp = document.querySelector('.downloaded-info-arrow');
    arrowUp.classList.add(className);
}

function setArrowPosition() {
    if (isEdge()) {
        setArrowClass('arrow-edge');
    } else if (isChrome()) {
        setArrowClass('arrow-chrome');
    } else if (isFirefox()) {
        setArrowClass('arrow-firefox');
    }
}

function isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

function isFirefox() {
    return typeof InstallTrigger !== 'undefined';
}

function isEdge() {
    return /Edg/.test(navigator.userAgent);
}