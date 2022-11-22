import { PixabayApi } from './js/fetch-api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('div.photo-card a', {
  captionDelay: 250,
});
const pixabyApi = new PixabayApi();

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const onClickBtnLoad = document.querySelector('.load-btn');

searchFormEl.addEventListener('submit', onSearchFormSubmit);
onClickBtnLoad.addEventListener('click', onLoadMoreBtn);

async function onSearchFormSubmit(event) {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  const searchData = searchQuery.value.toLowerCase().trim();

  if (!searchData) {
    Notiflix.Notify.failure('Please, enter your request.');
    return;
  }
  galleryEl.innerHTML = '';
  pixabyApi.page = 1;
  pixabyApi.searchQuery = searchData;

  try {
    const response = await pixabyApi.fetchPhotos();
    const { data } = response;
    const loadMoreImg = pixabyApi.page <= Math.ceil(data.totalHits / 12);

    if (!data.total) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (!loadMoreImg) {
      renderImageList(data.hits);
      return;
    } else {
      onClickBtnLoad.classList.remove('is-hidden');
      renderImageList(data.hits);
      Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
      lightbox.refresh();
    }
  } catch (err) {
    console.log(err.message);
  }
}

function renderImageList(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
       <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy"/></a>
        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item-api"> ${likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${downloads}</span> 
            </p>
        </div>
    </div>`;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

async function onLoadMoreBtn() {
  try {
    const response = await pixabyApi.fetchPhotos();
    const { data } = response;
    if (data.hits.length >= 12) {
      Notiflix.Notify.success(
        `Hooray! We found ${(pixabyApi.page - 1) * 12} images.`
      );
      renderImageList(data.hits);
    } else if (data.hits.length < 12) {
      onClickBtnLoad.classList.add('is-hidden');

      renderImageList(data.hits);
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
  } catch (err) {
    console.log(err);
  }
}
