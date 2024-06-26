import { useEffect, useMemo, useState } from 'react'
import { useSession } from "next-auth/react";

import Placeholder from '@tiptap/extension-placeholder'

import { Editor, useEditor } from '@tiptap/react'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider'
import type { Doc as YDoc } from 'yjs'

import { ExtensionKit } from '../extensions/extension-kit'
import { userColors, userNames } from '../lib/constants'
import { randomElement } from '../lib/utils'
import { EditorUser } from '../types'
import { useSidebar } from './useSidebar'
import { initialContent } from '../lib/data/initialContent'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditor = ({
  ydoc,
  provider,
}: {
  ydoc: YDoc
  provider?: TiptapCollabProvider | null | undefined
}) => {
  const { data: session } = useSession();
  const leftSidebar = useSidebar()
  const [collabState, setCollabState] = useState<WebSocketStatus>(WebSocketStatus.Connecting)

  const editor = useEditor(
    {
      autofocus: true,
      onCreate: ({ editor }) => {
        provider?.on('synced', () => {
          if (editor.isEmpty) {
            editor.commands.setContent(initialContent)
          }
        })
      },
      extensions: [
        ...ExtensionKit({
          provider,
        }),
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider,
          user: {
            name: session?.user?.full_name || randomElement(userNames),
            color: randomElement(userColors),
            avatar: session?.user?.avatar || 'https://unavatar.io/github/ueberdosis',
          },
        }),
        Placeholder.configure({
          emptyEditorClass: 'empty-editor',
          placeholder: 'Start writing...',
        }),
      ],
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [ydoc, provider],
  )

  const users = useMemo(() => {
    if (!editor?.storage.collaborationCursor?.users) {
      return []
    }

    return editor.storage.collaborationCursor?.users.map((user: EditorUser) => {
      const names = user.name?.split(' ')
      const firstName = names?.[0]
      const lastName = names?.[names.length - 1]
      const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`

      return { ...user, initials: initials.length ? initials : '?' }
    })
  }, [editor?.storage.collaborationCursor?.users])

  const characterCount = editor?.storage.characterCount || { characters: () => 0, words: () => 0 }

  useEffect(() => {
    provider?.on('status', (event: { status: WebSocketStatus }) => {
      setCollabState(event.status)
    })
  }, [provider])
  

  useEffect(() => {
    window.editor = editor
    console.log('editor', editor)
  }, [editor])

  return { editor, users, characterCount, collabState, leftSidebar }
}
