import { useEffect, useMemo, useState } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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

import axios from 'axios'

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
  const router = useRouter()
  const leftSidebar = useSidebar()
  const [collabState, setCollabState] = useState<WebSocketStatus>(WebSocketStatus.Connecting)
  const [content, setContent] = useState(null)

  useEffect(() => {
    if (router.query.document_id && session) {
      if (!content) getDocument()
    }
  }, [router.query.document_id, session])

  const editor = useEditor(
    {
      autofocus: true,
      onCreate: ({ editor }) => {
        // provider?.on('synced', () => {
        //   if (editor.isEmpty) {
        //     editor.commands.setContent(initialContent)
        //   }
        // })

        if (content) {
          editor.commands.setContent(content)
        }
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
        })
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

  useEffect(() => {
    if (content) {
      editor?.commands.setContent(content)
    }
  }, [content])

  const getDocument = async () => {
    const headers = {
      "Authorization": `Bearer ${session?.accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/assistants/writing-assistant/documents/${router.query.document_id}/show`, {
        headers: headers
      })

      if (res.data && res.data.document) {
        setContent(res.data.document.content)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return { editor, users, characterCount, collabState, leftSidebar }
}
