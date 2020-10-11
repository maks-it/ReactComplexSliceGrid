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

import React from 'react'
import PropTypes from 'prop-types'

// import CanUseDOM from '../../../functions/CanUseDOM'

// CSS Modulses Server Side Prerendering
// const s = CanUseDOM() ? require('./scss/style.module.scss') : require('./scss/style.module.scss.json')

const SortIndicator = (props) => {
  const { sortDirection } = props

  const drawIndicator = () => {
    switch(sortDirection) {
      case 'asc':
        return <i className="fas fa-sort-down"></i>
      case 'desc':
        return <i className="fas fa-sort-up"></i>     
      default:
        return <i className="fas fa-sort"></i>
    }
  }

  return drawIndicator()
}

SortIndicator.propTypes = {
  sortDirection: PropTypes.number,
 
}

SortIndicator.defaultProps = {
  sortDirection: '',
}

export default SortIndicator
