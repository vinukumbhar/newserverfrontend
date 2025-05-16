
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill Snow theme
import 'quill-emoji/dist/quill-emoji.css'; // Emoji styles
import Quill from 'quill';
import 'quill-emoji';

Quill.register('modules/emoji', require('quill-emoji'));
export default function Editor({ initialContent, onChange,value }) {
  const [editorContent, setEditorContent] = useState(initialContent);

  
  // Toolbar configuration similar to what you had in mui-tiptap
  const modules = {
    toolbar: [
      [{ 'font': [] }, {  'size': [] }], // Font family and size
      [{ 'header': '1' }, { 'header': '2' }, { 'align': [] }],
      ['bold', 'italic', 'underline', 'strike'], // Formatting options
      [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript/Superscript
      [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
      [{ 'color': [] }, { 'background': [] }], // Text color and highlight
      ['blockquote', 'code-block'], // Blockquote and code
      ['link', 'image'], // Links and images
        [{ 'emoji': true }],
      [{ 'indent': '-1' }, { 'indent': '+1' }], // Indent/unindent
      ['clean'], // Remove formatting
      ['undo', 'redo'], // Undo/Redo
    
    ],
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true,
    },
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'script', 'list', 'bullet', 'indent',
    'color', 'background', 'align',
    'blockquote', 'code-block', 'link', 'image',
    'undo', 'redo','emoji'
  ];

  useEffect(() => {
    if (initialContent) {
      setEditorContent(initialContent);
    }
  }, [initialContent]);

  const handleChange = (content) => {
    setEditorContent(content);
    onChange(content); // Call the onChange prop with the current content
  };

  return (
    <Box
      sx={{height:'250px'}}
    >
      <ReactQuill
        // value={editorContent}
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        style={{ height: '150px' }}
      />
    </Box>
  );
}



