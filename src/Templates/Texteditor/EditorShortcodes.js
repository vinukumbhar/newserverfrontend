
import React, { useEffect, useState } from 'react';
import {
    Box, Button, List,
    ListItem,
    ListItemText, Popover
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill Snow theme
import 'quill-emoji/dist/quill-emoji.css'; // Emoji styles
import Quill from 'quill';
import 'quill-emoji';
import { useTheme } from '@mui/material';
Quill.register('modules/emoji', require('quill-emoji'));



export default function Editor({ initialContent, onChange }) {
    const theme = useTheme();
    const [shortcuts, setShortcuts] = useState([]);
    const [selectedOption, setSelectedOption] = useState('contacts');
    const [filteredShortcuts, setFilteredShortcuts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

    const [editorContent, setEditorContent] = useState(initialContent || '');



    // Define formats for Quill
    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'color', 'background',
        'align', 'code-block', 'script','emoji'
    ];

    // Define modules for Quill
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'size': [] }],
            [{ 'bold': true }, { 'italic': true }, { 'underline': true }, { 'strike': true }, { 'blockquote': true }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
             [{ 'emoji': true }],
            ['clean'] // Remove formatting button
        ],
         'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
    };
    // Handle content change
    const handleEditorChange = (content, delta, source, editor) => {
        setEditorContent(content);
        onChange(content); // Call the onChange prop with the current content
    };

    const handleUploadFiles = (files) => {
        return files.map((file) => ({
            src: URL.createObjectURL(file),
            alt: file.name,
        }));
    };

    useEffect(() => {
        if (initialContent) {
            setEditorContent(initialContent);
        }
    }, [initialContent]);

    const handleOpenDropdown = (event) => {
        setPopoverPosition({
            top: event.currentTarget.getBoundingClientRect().bottom + window.scrollY,
            left: event.currentTarget.getBoundingClientRect().left + window.scrollX,
        });
        setShowDropdown(!showDropdown);
    };

    const handleCloseDropdown = () => {
        setShowDropdown(false);
    };

    const handleAddShortcut = (shortcode) => {
        setEditorContent((prevContent) => (prevContent || '') + ` [${shortcode}]`);
        setShowDropdown(false);
    };

    useEffect(() => {
        // Set shortcuts based on selected option
        if (selectedOption === 'contacts') {
            const contactShortcuts = [
                { title: 'Account Shortcodes', isBold: true },
                { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
                { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
                { title: 'Contact Shortcodes', isBold: true, },
                { title: 'Contact Name', isBold: false, value: 'CONTACT_NAME' },
                { title: 'First Name', isBold: false, value: 'FIRST_NAME' },
                { title: 'Middle Name', isBold: false, value: 'MIDDLE_NAME' },
                { title: 'Last Name', isBold: false, value: 'LAST_NAME' },
                { title: 'Phone number', isBold: false, value: 'PHONE_NUMBER' },
                { title: 'Country', isBold: false, value: 'COUNTRY' },
                { title: 'Company name', isBold: false, value: 'COMPANY_NAME ' },
                { title: 'Street address', isBold: false, value: 'STREET_ADDRESS' },
                { title: 'City', isBold: false, value: 'CITY' },
                { title: 'State/Province', isBold: false, value: 'STATE / PROVINCE' },
                { title: 'Zip/Postal code', isBold: false, value: 'ZIP / POSTAL CODE' },
                { title: 'Custom field:Email', isBold: false, value: 'CONTACT_CUSTOM_FIELD:Email' },
                { title: 'Date Shortcodes', isBold: true },
                { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
                { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
                { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
                { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
                { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
                { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
                { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
                { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
                { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
                { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
                { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
                { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
                { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
                { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
                { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
                { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
                { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
                { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
                { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
                { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
                { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
                { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
                { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
                { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
            ];
            setShortcuts(contactShortcuts);
        } else if (selectedOption === 'account') {
            const accountShortcuts = [
                { title: 'Account Shortcodes', isBold: true },
                { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
                { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
                { title: 'Date Shortcodes', isBold: true },
                { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
                { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
                { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
                { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
                { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
                { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
                { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
                { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
                { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
                { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
                { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
                { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
                { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
                { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
                { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
                { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
                { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
                { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
                { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
                { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
                { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
                { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
                { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
                { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
            ];
            setShortcuts(accountShortcuts);
        }
    }, [selectedOption]);

    useEffect(() => {
        setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes('')));
    }, [shortcuts]);

    return (
        <Box

        >

            <div className="editor-container">
                <ReactQuill
                    value={editorContent}
                    onChange={handleEditorChange}
                    theme="snow"
                    modules={modules}  // Pass the defined modules
                    formats={formats}  // Pass the defined formats
                    style={{ height: '250px', }}
                />
            </div>
            <Box sx={{mt:3}}>
                <Button onClick={handleOpenDropdown} variant="contained"  sx={{
                backgroundColor: 'var(--color-save-btn)',  // Normal background
               
                '&:hover': {
                  backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                },
                mt:7,borderRadius:'15px'
              }}>
                    Shortcode
                </Button>
                <Popover
                    open={showDropdown}
                    onClose={handleCloseDropdown}
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: popoverPosition.top, left: popoverPosition.left }}
                >
                    <Box>
                        <List className="dropdown-list" sx={{ width: '300px', height: '300px', cursor: 'pointer' }}>
                            {filteredShortcuts.map((shortcut, index) => (
                                <ListItem
                                    key={index}
                                    onClick={() => handleAddShortcut(shortcut.value)}
                                >
                                    <ListItemText
                                        primary={shortcut.title}
                                        primaryTypographyProps={{
                                            style: {
                                                fontWeight: shortcut.isBold ? 'bold' : 'normal',
                                            },
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Popover>
            </Box>

        </Box>
    );
}
