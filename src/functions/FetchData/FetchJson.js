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

import fetch from 'node-fetch'

const FetchJson = async (props) => {
  const { url, method, headers = {}, body, sysToken } = props

  const sendData = {
    method: method,
    headers: {
      ...{
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      ...headers
    }
  }

  if (sysToken) {
    sendData.headers.Authorization = `Bearer ${sysToken}`
  }

  if (body) {
    sendData.body = body
  }

  const result = await fetch(url, sendData)
    .then(response => {
      return { status: response.status, statusText: response.statusText, text: response.text() }
    })
    .then(async (response) => {
      const data = {
        status: response.status,
        statusText: response.statusText
      }

      await response.text.then(text => {
        try {
          data.content = JSON.parse(text)
        } catch (err) {
          console.log(err)
          console.log(text)
        }
      })

      return data
    })
    .catch(error => {
      console.log(error)
      return {
        status: 500,
        content: error
      }
    })

  return result
}

export default FetchJson
