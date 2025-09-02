"use client"

import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react"

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-red-600 hover:text-red-800 underline cursor-pointer',
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      handleKeyDown(view, event) {
        // Custom behavior for Enter key
        if (event.key === "Enter") {
          const { state, dispatch } = view;
          const tr = state.tr;

          // Remove all active marks
          state.storedMarks?.forEach((mark) => {
            tr.removeStoredMark(mark.type);
          });

          dispatch(tr);
        }
        return false;
      },
    },
  })

  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [isLinkActive, setIsLinkActive] = useState(false)
  const [linkError, setLinkError] = useState("")

  useEffect(() => {
    if (editor) {
      setIsLinkActive(editor.isActive('link'))
      if (value !== editor.getHTML()) {
        editor.commands.setContent(value)
      }
    }
  }, [editor, value])

  if (!editor) {
    return null
  }

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch (_) {
      return url.startsWith('#') || url.startsWith('/') || url.startsWith('mailto:') || url.startsWith('tel:')
    }
  }

  const addLink = () => {
    if (!linkUrl.trim()) {
      setLinkError('Please enter a URL')
      return
    }

    // Add https:// if no protocol is present and it's not an anchor/link
    let processedUrl = linkUrl.trim()
    if (!/^https?:\/\//i.test(processedUrl) && 
        !processedUrl.startsWith('#') && 
        !processedUrl.startsWith('/') &&
        !processedUrl.startsWith('mailto:') &&
        !processedUrl.startsWith('tel:')) {
      processedUrl = 'https://' + processedUrl
    }

    if (!validateUrl(processedUrl)) {
      setLinkError('Please enter a valid URL')
      return
    }

    editor.chain().focus().extendMarkRange('link')
      .setLink({ href: processedUrl })
      .run()
    
    setLinkUrl('')
    setShowLinkInput(false)
    setLinkError('')
  }

  const handleLinkButtonClick = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      setShowLinkInput(false)
    } else {
      setShowLinkInput(true)
      // Get selected text to pre-fill if any
      const { from, to } = editor.state.selection
      if (from !== to) {
        const text = editor.state.doc.textBetween(from, to, ' ')
        if (text) {
          setLinkUrl(text)
        }
      }
    }
  }

  return (
    <div className="border rounded-md prose max-w-none">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 text-3xl w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={isLinkActive}
          onPressedChange={handleLinkButtonClick}
          aria-label="Add Link"
          className={isLinkActive ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}
        >
          <LinkIcon className={`h-4 w-4 ${isLinkActive ? 'text-blue-700' : ''}`} />
        </Toggle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {showLinkInput && (
        <div className="relative p-3 border-b bg-gray-50">
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-1">
              <Input
                type="text"
                placeholder="https://example.com or /page"
                value={linkUrl}
                onChange={(e) => {
                  setLinkUrl(e.target.value)
                  if (linkError) setLinkError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addLink()
                  } else if (e.key === 'Escape') {
                    e.preventDefault()
                    setShowLinkInput(false)
                    setLinkUrl('')
                    setLinkError('')
                  }
                }}
                className={`h-9 ${linkError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                autoFocus
              />
              {linkError && (
                <p className="text-xs text-red-500 mt-1">{linkError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Supports: https://, /page, #section, mailto:, tel:
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                size="sm" 
                onClick={addLink}
                className="h-9 px-4 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Link
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setShowLinkInput(false)
                  setLinkUrl('')
                  setLinkError('')
                }}
                className="h-9 px-4 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        className="relative p-4 min-h-[200px] cursor-text"
        onClick={() => editor?.chain().focus().run()}
      >
        <EditorContent
          editor={editor}
          className="prose prose-sm md:prose-base max-w-none max-h-none focus:outline-none"
        />
        {editor && editor.isEmpty && (
          <p className="pointer-events-none absolute top-4 left-4 text-muted-foreground">
            Start typing...
          </p>
        )}
      </div>
    </div>
  )
}