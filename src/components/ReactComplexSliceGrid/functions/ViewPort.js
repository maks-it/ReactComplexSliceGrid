  /**
   * This is slightly changed function taken from:
   * * https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/
   * @param {HTMLElement} parentElem 
   * @param {HTMLElement} elem 
   */
  const IsInViewPort =  (parentElem, elem) => {
    const parentRect = parentElem.getBoundingClientRect();
    const rect = elem.getBoundingClientRect();

    /* 
    // Original
    return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left >= 0 && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    */

    // console.log(parentRect)
    // console.log(rect)

    /*
    // Element is fully visible
    return rect.top >= parentRect.top && rect.bottom <= parentRect.bottom - 25 &&
    rect.left >= parentRect.left && rect.right <= parentRect.right - 25
    */

    const scrollBarWidth = 50

    // Element top or right visible
    return parentRect.left <= rect.left && rect.left <= parentRect.right - scrollBarWidth &&
    parentRect.top <= rect.top && rect.top <= parentRect.bottom - scrollBarWidth
  }

  /**
   * Giving tabIndex, this functions searches it into the DOM and returns:
   * * true - element is in the viewport
   * * false - element isn't in DOM
   * @param {HTMLElement} parentElem 
   * @param {number} tabIndex 
   */
  const FocusTabIndex = (parentElem, tabIndex) => {
    // retreive all elements having tabindex in the DOM tree
    const elems = parentElem.querySelectorAll('[tabindex]')

    let found = false
    for (let i = 0, len = elems.length; i < len; i++) {
      let elem = elems[i]

      // tabindex exists in the DOM tree
      if (tabIndex === +(elem.getAttribute('tabindex'))) {
        if (!IsInViewPort(parentElem, elem)) break

        // focus visible tabindex
        if(elem.getAttribute('contenteditable')) {
          elem.click()
        } else {
          // https://webplatform.news/issues/2019-04-19
          // https://html.spec.whatwg.org/multipage/interaction.html#focus-management-apis
          elem.focus([{ preventScroll: true }])
        }

        found = true
      }
    }

    return found
  }

export {
    IsInViewPort,
    FocusTabIndex
}