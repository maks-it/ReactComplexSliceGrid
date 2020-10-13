import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import {Editor, EditorState, ContentState} from 'draft-js';


const MyInput = (props) => {
    const { name, value, onChange } = props
    const [editorState, setEditorState] = useState(() => EditorState.createWithContent(ContentState.createFromText(value))) // EditorState.createEmpty())

    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        if(!enabled) setEditorState(() => EditorState.createWithContent(ContentState.createFromText(value)))
    }, [value])

  
    return <div onClick={() => setEnabled(true)} onBlur={() => setEnabled(false)}>
        {!enabled
            ? <div dangerouslySetInnerHTML ={{__html: value === '' ? '&nbsp;' : value }}
                style = {{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}></div>
            : <Editor editorState={editorState} enabled={enabled}
                onChange={(editorState) => {
                    setEditorState(editorState)

                    onChange({
                        target: {
                            name: name,
                            value: editorState.getCurrentContent().getPlainText('\u0001')
                        }
                    })
                }} />}
        </div>
  }

  MyInput.defaultProps = {
      value: ''
  }

  export default MyInput
