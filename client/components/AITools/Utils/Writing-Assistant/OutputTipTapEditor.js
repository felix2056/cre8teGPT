import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import CharacterCount from '@tiptap/extension-character-count';

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

const OutputTipTapEditor = ({ content, setContent }) => {
    const editor = useEditor({
        editable: false,
        extensions: [
            StarterKit,
            Highlight,
            TextStyle,
            Color,
            CharacterCount
        ],
        content: content,
        onUpdate({ editor }) {
            setContent(editor.getHTML())
        },
    });

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(content)
        }
    }, [content]);

    return (
        <div className="tip-tap-editor">
            {/* <MenuBar editor={editor} /> */}
            {editor && <EditorContent editor={editor} />}

            {editor && (
                <div className="row">
                    <div className="col-lg-6">
                        <div className="character-count">
                            <svg
                                height="20"
                                width="20"
                                viewBox="0 0 20 20"
                            >
                                <circle
                                    r="10"
                                    cx="10"
                                    cy="10"
                                    fill="#e9ecef"
                                />
                                <circle
                                    r="5"
                                    cx="10"
                                    cy="10"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    strokeDasharray={`calc(100 * 31.4 / 100) 31.4`}
                                    transform="rotate(-90) translate(-20)"
                                />
                                <circle
                                    r="6"
                                    cx="10"
                                    cy="10"
                                    fill="white"
                                />
                            </svg>

                            {editor.storage.characterCount.characters()} characters
                            <br />
                            {editor.storage.characterCount.words()} words
                        </div>
                    </div>
                    {/* <div className="col-lg-6">
                        <div className="row">
                            <button className="col-lg-6" onClick={() => editor.chain().focus().undo().run()}>
                                <span className="fas fa-angle-up"></span>
                            </button>
                            <button className="col-lg-6" onClick={() => editor.chain().focus().redo().run()}>
                                <span className="fas fa-angle-down"></span>
                            </button>
                        </div>
                    </div> */}
                </div>
            )}
        </div>
    )
}

export default OutputTipTapEditor;