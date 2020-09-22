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
import classNames from 'classnames'

// CSS Modulses Server Side Prerendering
import s from './scss/style.module.scss'

const HeadCell = (props) => {
  const { className, children, ...others } = props
  return <th className={classNames(s.th, className)} { ...others } >{children}</th>
}

const BodyCell = (props) => {
  const { className, children, ...others } = props
  return <td className={classNames(s.td, className)} { ...others }>{children}</td>
}

const defaultProps = {
  others: null
}

HeadCell.defaultProps = defaultProps
BodyCell.defaultProps = defaultProps

const propTypes = {
  className: PropTypes.array,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ])
}
HeadCell.propTypes = propTypes
BodyCell.propTypes = propTypes

export { HeadCell, BodyCell }
