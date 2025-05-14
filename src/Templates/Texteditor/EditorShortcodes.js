
// import React, { useEffect, useState } from 'react';
// import {
//     Box, Button, List,
//     ListItem,
//     ListItemText, Popover
// } from '@mui/material';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Quill Snow theme
// import 'quill-emoji/dist/quill-emoji.css'; // Emoji styles
// import Quill from 'quill';
// import 'quill-emoji';
// Quill.register('modules/emoji', require('quill-emoji'));
// export default function Editor({ initialContent, onChange }) {
   
//     const [shortcuts, setShortcuts] = useState([]);
//     const [selectedOption, setSelectedOption] = useState('contacts');
//     const [filteredShortcuts, setFilteredShortcuts] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
//     const [editorContent, setEditorContent] = useState(initialContent || '');
//     // Define formats for Quill
//     const formats = [
//         'header', 'font', 'size',
//         'bold', 'italic', 'underline', 'strike', 'blockquote',
//         'list', 'bullet', 'indent',
//         'link', 'image', 'color', 'background',
//         'align', 'code-block', 'script','emoji'
//     ];

//     // Define modules for Quill
//     const modules = {
//         toolbar: [
//             [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
//             [{ 'size': [] }],
//             [{ 'bold': true }, { 'italic': true }, { 'underline': true }, { 'strike': true }, { 'blockquote': true }],
//             [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
//             [{ 'color': [] }, { 'background': [] }],
//             [{ 'align': [] }],
//             ['link', 'image'],
//              [{ 'emoji': true }],
//             ['clean'] // Remove formatting button
//         ],
//          'emoji-toolbar': true,
//     'emoji-textarea': false,
//     'emoji-shortname': true,
//     };
    // // Handle content change
    // const handleEditorChange = (content) => {
    //     setEditorContent(content);
    //     onChange(content); // Call the onChange prop with the current content
    // };

    // useEffect(() => {
    //     if (initialContent) {
    //         setEditorContent(initialContent);
    //     }
    // }, [initialContent]);

    // const handleOpenDropdown = (event) => {
    //     setPopoverPosition({
    //         top: event.currentTarget.getBoundingClientRect().bottom + window.scrollY,
    //         left: event.currentTarget.getBoundingClientRect().left + window.scrollX,
    //     });
    //     setShowDropdown(!showDropdown);
    // };

//     const handleCloseDropdown = () => {
//         setShowDropdown(false);
//     };

//     const handleAddShortcut = (shortcode) => {
//         setEditorContent((prevContent) => (prevContent || '') + ` [${shortcode}]`);
//         setShowDropdown(false);
//     };

//     useEffect(() => {
//         // Set shortcuts based on selected option
//         if (selectedOption === 'contacts') {
//             const contactShortcuts = [
//                 { title: 'Account Shortcodes', isBold: true },
//                 { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
//                 { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
//                 { title: 'Contact Shortcodes', isBold: true, },
//                 { title: 'Contact Name', isBold: false, value: 'CONTACT_NAME' },
//                 { title: 'First Name', isBold: false, value: 'FIRST_NAME' },
//                 { title: 'Middle Name', isBold: false, value: 'MIDDLE_NAME' },
//                 { title: 'Last Name', isBold: false, value: 'LAST_NAME' },
//                 { title: 'Phone number', isBold: false, value: 'PHONE_NUMBER' },
//                 { title: 'Country', isBold: false, value: 'COUNTRY' },
//                 { title: 'Company name', isBold: false, value: 'COMPANY_NAME ' },
//                 { title: 'Street address', isBold: false, value: 'STREET_ADDRESS' },
//                 { title: 'City', isBold: false, value: 'CITY' },
//                 { title: 'State/Province', isBold: false, value: 'STATE / PROVINCE' },
//                 { title: 'Zip/Postal code', isBold: false, value: 'ZIP / POSTAL CODE' },
//                 { title: 'Custom field:Email', isBold: false, value: 'CONTACT_CUSTOM_FIELD:Email' },
//                 { title: 'Date Shortcodes', isBold: true },
//                 { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
//                 { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
//                 { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
//                 { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
//                 { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
//                 { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
//                 { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
//                 { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
//                 { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
//                 { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
//                 { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
//                 { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
//                 { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
//                 { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
//                 { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
//                 { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
//                 { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
//                 { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
//                 { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
//                 { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
//                 { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
//                 { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
//                 { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
//                 { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
//             ];
//             setShortcuts(contactShortcuts);
//         } else if (selectedOption === 'account') {
//             const accountShortcuts = [
//                 { title: 'Account Shortcodes', isBold: true },
//                 { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
//                 { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
//                 { title: 'Date Shortcodes', isBold: true },
//                 { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
//                 { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
//                 { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
//                 { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
//                 { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
//                 { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
//                 { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
//                 { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
//                 { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
//                 { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
//                 { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
//                 { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
//                 { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
//                 { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
//                 { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
//                 { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
//                 { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
//                 { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
//                 { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
//                 { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
//                 { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
//                 { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
//                 { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
//                 { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
//             ];
//             setShortcuts(accountShortcuts);
//         }
//     }, [selectedOption]);

//     useEffect(() => {
//         setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes('')));
//     }, [shortcuts]);

//     return (
//         <Box

//         >

//             <div className="editor-container">
//                 <ReactQuill
//                     value={editorContent}
//                     onChange={handleEditorChange}
//                     theme="snow"
//                     modules={modules}  // Pass the defined modules
//                     formats={formats}  // Pass the defined formats
//                     style={{ height: '250px', }}
//                 />
//             </div>
//             <Box sx={{mt:3}}>
//                 <Button onClick={handleOpenDropdown} variant="contained"  sx={{
//                 backgroundColor: 'var(--color-save-btn)',  // Normal background
               
//                 '&:hover': {
//                   backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
//                 },
//                 mt:7,borderRadius:'15px'
//               }}>
//                     Shortcode
//                 </Button>
                // <Popover
                //     open={showDropdown}
                //     onClose={handleCloseDropdown}
                //     anchorReference="anchorPosition"
                //     anchorPosition={{ top: popoverPosition.top, left: popoverPosition.left }}
                // >
                //     <Box>
                //         <List className="dropdown-list" sx={{ width: '300px', height: '300px', cursor: 'pointer' }}>
                //             {filteredShortcuts.map((shortcut, index) => (
                //                 <ListItem
                //                     key={index}
                //                     onClick={() => handleAddShortcut(shortcut.value)}
                //                 >
                //                     <ListItemText
                //                         primary={shortcut.title}
                //                         primaryTypographyProps={{
                //                             style: {
                //                                 fontWeight: shortcut.isBold ? 'bold' : 'normal',
                //                             },
                //                         }}
                //                     />
                //                 </ListItem>
                //             ))}
                //         </List>
                //     </Box>
                // </Popover>
//             </Box>

//         </Box>
//     );
// }


// import React, { useEffect, useState, useRef } from 'react';
// import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Quill Snow theme
// import 'quill-emoji/dist/quill-emoji.css'; // Emoji styles
// import Quill from 'quill';
// import 'quill-emoji';

// Quill.register('modules/emoji', require('quill-emoji'));

// export default function Editor({ initialContent, onChange }) {
//   const [editorContent, setEditorContent] = useState(initialContent);
//   const [selectedOption, setSelectedOption] = useState('contacts'); // Default dropdown value
//   const [shortcuts, setShortcuts] = useState([]);
//   const quillRef = useRef(null); // Reference to Quill editor

//   // Function to insert shortcode at cursor position
//   const insertShortcode = (value) => {
//     if (quillRef.current) {
//       const editor = quillRef.current.getEditor();
//       const range = editor.getSelection();
//       if (range) {
//         editor.insertText(range.index, `[${value}]`);
//         editor.setSelection(range.index + value.length + 4); // Move cursor after inserted text
//       }
//     }
//   };

//   // Set shortcuts based on selected option
//   useEffect(() => {
//     const contactShortcuts = [
//       { title: 'Contact Name', value: 'CONTACT_NAME' },
//       { title: 'First Name', value: 'FIRST_NAME' },
//       { title: 'Last Name', value: 'LAST_NAME' },
//       { title: 'Phone number', value: 'PHONE_NUMBER' },
//       { title: 'Email', value: 'EMAIL' }
//     ];

//     const accountShortcuts = [
//       { title: 'Account Name', value: 'ACCOUNT_NAME' },
//       { title: 'Website', value: 'ACCOUNT_CUSTOM_FIELD:Website' },
//       { title: 'City', value: 'CITY' },
//       { title: 'State', value: 'STATE' }
//     ];

//     setShortcuts(selectedOption === 'contacts' ? contactShortcuts : accountShortcuts);
//   }, [selectedOption]);

//   const handleChange = (content) => {
//     setEditorContent(content);
//     onChange(content);
//   };

//   // Toolbar configuration with a placeholder for shortcode dropdown
//   const modules = {
//     toolbar: {
//       container: [
//         [{ 'font': [] }, { 'size': [] }],
//         [{ 'header': '1' }, { 'header': '2' }, { 'align': [] }],
//         ['bold', 'italic', 'underline', 'strike'],
//         [{ 'script': 'sub' }, { 'script': 'super' }],
//         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//         [{ 'color': [] }, { 'background': [] }],
//         ['blockquote', 'code-block'],
//         ['link', 'image'],
//         [{ 'emoji': true }],
//         [{ 'indent': '-1' }, { 'indent': '+1' }],
//         ['clean'],
//         ['undo', 'redo'],
//       ],
//     },
//     'emoji-toolbar': true,
//     'emoji-textarea': false,
//     'emoji-shortname': true,
//     history: {
//       delay: 1000,
//       maxStack: 50,
//       userOnly: true,
//     },
//   };

//   const formats = [
//     'header', 'font', 'size',
//     'bold', 'italic', 'underline', 'strike',
//     'script', 'list', 'bullet', 'indent',
//     'color', 'background', 'align',
//     'blockquote', 'code-block', 'link', 'image',
//     'undo', 'redo', 'emoji'
//   ];

//   return (
//     <Box sx={{ height: '250px' }}>
//       {/* Shortcodes Dropdown */}
//       <FormControl sx={{ minWidth: 200, marginBottom: 1 }}>
//         <InputLabel>Insert Shortcode</InputLabel>
//         <Select
//           value=""
//           onChange={(e) => insertShortcode(e.target.value)}
//           displayEmpty
//         >
//           <MenuItem disabled>Select a shortcode</MenuItem>
//           {shortcuts.map((shortcut, index) => (
//             <MenuItem key={index} value={shortcut.value}>
//               {shortcut.title}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {/* Quill Editor */}
//       <ReactQuill
//         ref={quillRef}
//         value={editorContent}
//         onChange={handleChange}
//         modules={modules}
//         formats={formats}
//         theme="snow"
//         style={{ height: '150px' }}
//       />
//     </Box>
//   );
// }


import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Popover, List, ListItem, ListItemText } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill Snow theme
import 'quill-emoji/dist/quill-emoji.css'; // Emoji styles
import Quill from 'quill';
import 'quill-emoji';

Quill.register('modules/emoji', require('quill-emoji'));

export default function Editor({ initialContent, onChange }) {
    const [editorContent, setEditorContent] = useState(initialContent || '');
  const [shortcuts, setShortcuts] = useState([]);
  const quillRef = useRef(null); // Reference to Quill editor
 const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [popoverAnchor, setPopoverAnchor] = useState(null);
 useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);

  useEffect(() => {
    // Set shortcuts based on selected option
    if (selectedOption === "contacts") {
      const contactShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
        { title: "Contact Shortcodes", isBold: true },
        { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
        { title: "First Name", isBold: false, value: "FIRST_NAME" },
        { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
        { title: "Last Name", isBold: false, value: "LAST_NAME" },
        { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
        { title: "Country", isBold: false, value: "COUNTRY" },
        { title: "Company name", isBold: false, value: "COMPANY_NAME " },
        { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
        { title: "City", isBold: false, value: "CITY" },
        { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
        { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
        { title: "Custom field:Email", isBold: false, value: "CONTACT_CUSTOM_FIELD:Email" },
        { title: "Date Shortcodes", isBold: true },
        { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
        { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
        { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
        { title: "Date Shortcodes", isBold: true },
        { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
        { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
        { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  // Open dropdown at button position
  const handleOpenDropdown = (event) => {
    setPopoverAnchor(event.currentTarget);
  };

  // Close dropdown
  const handleCloseDropdown = () => {
    setPopoverAnchor(null);
  };

  // Insert shortcode into editor at cursor position
  const insertShortcode = (value) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        editor.insertText(range.index, `[${value}]`);
        editor.setSelection(range.index + value.length + 4); // Move cursor after inserted text
      }
    }
    handleCloseDropdown();
  };
    // Handle content change
    const handleEditorChange = (content) => {
        setEditorContent(content);
        onChange(content); // Call the onChange prop with the current content
    };

    useEffect(() => {
        if (initialContent) {
            setEditorContent(initialContent);
        }
    }, [initialContent]);
  // Toolbar configuration
  const modules = {
    toolbar: {
      container: [
        [{ 'font': [] }, { 'size': [] }],
        [{ 'header': '1' }, { 'header': '2' }, { 'align': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ 'emoji': true }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['clean'],
        ['undo', 'redo'],
      ],
    },
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
    'undo', 'redo', 'emoji'
  ];

  return (
    <Box sx={{ height: '250px' }}>
          {/* Quill Editor */}
          <ReactQuill
        ref={quillRef}
        value={editorContent}
        onChange={(content) => {
          setEditorContent(content);
          onChange(content);
        }}
        modules={modules}
        formats={formats}
        theme="snow"
        style={{ height: '150px' }}
      />
      {/* Shortcodes Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDropdown}
        sx={{
          backgroundColor: "var(--color-save-btn)",
          "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
          borderRadius: "15px",
          mb: 1,
          mt:12
        }}
      >
        Insert Shortcode
      </Button>

      {/* Popover Dropdown */}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handleCloseDropdown}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 1 }}>
          <List sx={{ width: "250px", maxHeight: "200px", overflowY: "auto" }}>
            {filteredShortcuts.map((shortcut, index) => (
              <ListItem key={index} onClick={() => insertShortcode(shortcut.value)} button>
                <ListItemText
                  primary={shortcut.title}
                  primaryTypographyProps={{
                    style: {
                      fontWeight: shortcut.isBold ? "bold" : "normal",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>

  
    </Box>
  );
}
