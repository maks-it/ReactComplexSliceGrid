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
 * 
 * @param {number} from 
 * @param {number} to 
 * @param {Array} arr 
 */
const OffsetArrayIndex = (from, to, arr = []) => {
  if (from < to) {
    const start = arr.slice(0, from)
    const between = arr.slice(from + 1, to + 1)
    const end = arr.slice(to + 1)
    return [...start, ...between, arr[from], ...end]
  }
  if (from > to) {
    const start = arr.slice(0, to)
    const between = arr.slice(to, from)
    const end = arr.slice(from + 1)
    return [...start, arr[from], ...between, ...end]
  }
  return arr
}

export {
  OffsetArrayIndex
}
