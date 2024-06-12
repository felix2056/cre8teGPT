import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Code from '@tiptap/extension-code'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Underline from '@tiptap/extension-underline'
import Text from '@tiptap/extension-text'
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import Heading from '@tiptap/extension-heading';
import CodeBlock from '@tiptap/extension-code-block';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="menu-bar">
            <div className="button-group">
                <a onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-bold"></span>
                </a>
                <a onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-italic"></span>
                </a>
                <a onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={!editor.can().chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-underline"></span>
                </a>
                <a onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-strikethrough"></span>
                </a>
                <a onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-code"></span>
                </a>
                <a onClick={() => editor.chain().focus().toggleHighlight().run()} disabled={!editor.can().chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-highlighter"></span>
                </a>
            </div>
            <div className="button-group">
                <a onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-paragraph"></span>
                </a>
                <a onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-heading"></span>1
                </a>
                <a onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-heading"></span>2
                </a>
                <a onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-heading"></span>3
                </a>
            </div>
            <div className="button-group">
                <a onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-list-ul"></span>
                </a>
                <a onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-list-ol"></span>
                </a>
                <a onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-quote-right"></span>
                </a>
                <a onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    <span className="fas fa-minus"></span>
                </a>
                <a onClick={() => editor.chain().focus().setHardBreak().run()}>
                    <span className="fas fa-level-down-alt"></span>
                </a>
            </div>
            <div className="button-group">
                <a onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''} href='javascript:void(0)'>
                    <span className="fas fa-code"></span>
                </a>
            </div>
            <div className="button-group">
                <a onClick={() => editor.chain().focus().undo().run()}>
                    <span className="fas fa-undo"></span>
                </a>
                <a onClick={() => editor.chain().focus().redo().run()}>
                    <span className="fas fa-redo"></span>
                </a>
            </div>
        </div>
    );
};


const TipTapEditor = ({ content, setContent }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Typography,
            Code,
            Document,
            Paragraph,
            Underline,
            Text,
            BulletList,
            OrderedList,
            ListItem,
            Blockquote,
            Heading,
            CodeBlock,
        ],
        content: content,
        onUpdate({ editor }) {
            setContent(editor.getHTML())
        },
    })

    return (
        <div className="tip-tap-editor">
            <MenuBar editor={editor} />
            {editor && <EditorContent editor={editor} />}
        </div>
    )
}

export default TipTapEditor;