export function Google() {
  const googleImgElement = document.createElement('img');

  googleImgElement.src = 'assets/images/google.svg';

  googleImgElement.style = { width: '48px', height: '48px', }

  // googleImgElement.addEventListener('click', catchGoogle);

  return googleImgElement;
}

