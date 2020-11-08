  /**
 * @license
 * Internet Systems Consortium license
 *
 * Copyright (c) 2020 Maksym Sadovnychyy (MAKS-IT)
 * Website: https://maks-it.com
 * Email: commercial@maks-it.com
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 * THIS SOFTWARE.
 */
  
  /**
   * This is slightly changed function taken from:
   * * https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/
   * @param {HTMLElement} parentElem 
   * @param {HTMLElement} elem 
   * @param {number} rightMargin right margin
   * @param {number} bottomMargin bottom margin
   */
  const IsInViewPort =  (parentElem, elem, rightMargin = 50, bottomMargin = 50) => {
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

    // Element top or right visible
    return parentRect.left <= rect.left && rect.left <= parentRect.right - rightMargin &&
    parentRect.top <= rect.top && rect.top <= parentRect.bottom - bottomMargin
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
          elem.focus({ preventScroll:true })
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