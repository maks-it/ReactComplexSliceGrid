import React, { useEffect, useState } from 'react'
import {Editor, EditorState, ContentState} from 'draft-js';

const MyInput = (props) => {
    const { name, value, onChange } = props
    const [editorState, setEditorState] = useState(() => /*EditorState.createWithContent(ContentState.createFromText(value || ''))) */ EditorState.createEmpty())

    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        
        if(value && !enabled) {
            setEditorState(() => EditorState.createWithContent(ContentState.createFromText(value)))
        }
        
    }, [value])

  
    return <Editor editorState={editorState}
        onChange={(editorState) => {
            setEditorState(editorState)

            //const newVal =  editorState.getCurrentContent().getPlainText('\u0001')
            // if(newVal !== value) {
                onChange({
                    target: {
                        name: name,
                        value: editorState.getCurrentContent().getPlainText('\u0001')
                    }
                })
            // }

            
        }}
        
        onFocus={() => setEnabled(true)}
        onBlur={() => setEnabled(false)} />
  }

  export default MyInput
