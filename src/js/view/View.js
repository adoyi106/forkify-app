import icons from 'url:../../img/icons.svg';
export default class View {
  _errorMessage = 'The recipe cannot be found! Try again.';
  _message = '';

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup;
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log('🔥', newElements);
    // console.log('💥', curElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      console.log(!newEl.isEqualNode(curEl));
      console.log(curEl);

      // console.log(newEl.firstChild?.nodeValue.trim() !== '');
      //updating texts
      if (newEl.firstChild?.nodeValue.trim() !== '') {
        console.log(newEl);
        // curEl.textContent = newEl.textContent;
      }
      //   // console.log('💥', newEl.firstChild?.nodeValue.trim());
      //   // console.log('🎉🎉', !newEl.isEqualNode(curEl));
      //   console.log('💥', curEl);
      //   console.log('🔥', newEl);
      //   curEl.textContent = newEl.textContent;
      // }
      //updating changed attributes
      // if (!newEl.isEqualNode(curEl)) console.log(newEl.atrributes);
      // Array.from(newEl.attributes).forEach(attri =>
      //   curEl.setAttributes(attri.name, attri.value)
      // );
    });
  }
  renderSpinner = function () {
    const markup = `
          <svg>
          <use href="${icons}#icon-loader"></use>
          </svg>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
  renderError(message = this._errorMessage) {
    const markup = `
            <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
            `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
            <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
            `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
