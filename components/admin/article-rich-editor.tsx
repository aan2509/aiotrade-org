"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Bold,
  CloudUpload,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  ListChecks,
  List,
  Minus,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ListKeymap from "@tiptap/extension-list-keymap";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Underline from "@tiptap/extension-underline";
import type { HomepageAsset } from "@/components/landing/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeArticleContent } from "@/lib/article-content";
import { cn } from "@/lib/utils";

type ArticleRichEditorProps = {
  assets: HomepageAsset[];
  cloudinaryEnabled: boolean;
  onAssetsChange: (assets: HomepageAsset[]) => void;
  onChange: (value: string) => void;
  value: string;
};

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({ active = false, disabled = false, label, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition",
        active
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-300 bg-white text-stone-800 hover:bg-stone-50",
        disabled && "cursor-not-allowed opacity-40",
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function ArticleRichEditor({
  assets,
  cloudinaryEnabled,
  onAssetsChange,
  onChange,
  value,
}: ArticleRichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [assetLabel, setAssetLabel] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const normalizedInitialValue = useMemo(() => normalizeArticleContent(value), [value]);
  const editor = useEditor({
    content: normalizedInitialValue || "<p></p>",
    editorProps: {
      attributes: {
        class: "article-editor-content min-h-[420px] px-4 py-4 focus:outline-none",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      ListKeymap,
      Link.configure({
        HTMLAttributes: {
          class: "text-[#1b74df] underline underline-offset-4",
          rel: "noreferrer noopener",
          target: "_blank",
        },
        openOnClick: false,
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "mx-auto my-8 h-auto max-w-full rounded-2xl border border-stone-200 shadow-[0_14px_34px_rgba(15,23,42,0.08)]",
        },
      }),
      Placeholder.configure({
        placeholder: "Mulai tulis isi artikel di sini...",
      }),
    ],
    immediatelyRender: false,
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();
    const nextHtml = normalizeArticleContent(value) || "<p></p>";

    if (currentHtml !== nextHtml) {
      editor.commands.setContent(nextHtml, { emitUpdate: false });
    }
  }, [editor, value]);

  async function persistUploadedImage(file: File) {
    const signatureResponse = await fetch("/api/admin/homepage-assets/signature", {
      body: JSON.stringify({ filename: file.name }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!signatureResponse.ok) {
      const payload = (await signatureResponse.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? "Gagal membuat signature upload.");
    }

    const signaturePayload = (await signatureResponse.json()) as {
      apiKey: string;
      cloudName: string;
      folder: string;
      signature: string;
      timestamp: number;
    };

    const cloudinaryBody = new FormData();
    cloudinaryBody.append("file", file);
    cloudinaryBody.append("api_key", signaturePayload.apiKey);
    cloudinaryBody.append("timestamp", String(signaturePayload.timestamp));
    cloudinaryBody.append("signature", signaturePayload.signature);
    cloudinaryBody.append("folder", signaturePayload.folder);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`,
      {
        body: cloudinaryBody,
        method: "POST",
      },
    );

    if (!uploadResponse.ok) {
      const payload = (await uploadResponse.json().catch(() => null)) as { error?: { message?: string } } | null;
      throw new Error(payload?.error?.message ?? "Upload ke Cloudinary gagal.");
    }

    const uploaded = (await uploadResponse.json()) as {
      bytes?: number;
      format?: string;
      height?: number;
      original_filename?: string;
      public_id: string;
      secure_url: string;
      width?: number;
    };

    const persistResponse = await fetch("/api/admin/homepage-assets", {
      body: JSON.stringify({
        bytes: uploaded.bytes ?? null,
        format: uploaded.format ?? null,
        height: uploaded.height ?? null,
        label: assetLabel.trim() || uploaded.original_filename || file.name.replace(/\.[^.]+$/, ""),
        publicId: uploaded.public_id,
        secureUrl: uploaded.secure_url,
        width: uploaded.width ?? null,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!persistResponse.ok) {
      const payload = (await persistResponse.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? "Gagal menyimpan metadata asset.");
    }

    const payload = (await persistResponse.json()) as { asset: HomepageAsset };
    onAssetsChange([payload.asset, ...assets.filter((asset) => asset.id !== payload.asset.id)]);

    return payload.asset;
  }

  async function handleInlineUpload(file: File | null) {
    if (!cloudinaryEnabled) {
      setUploadError("Cloudinary belum dikonfigurasi.");
      return;
    }

    if (!file) {
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadMessage(null);

    try {
      const uploadedAsset = await persistUploadedImage(file);
      editor?.chain().focus().setImage({ src: uploadedAsset.secureUrl, alt: uploadedAsset.label }).run();
      setUploadMessage("Gambar berhasil ditambahkan ke artikel.");
      setAssetLabel("");
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload asset gagal.");
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function promptForLink() {
    if (!editor) {
      return;
    }

    const currentUrl = editor.getAttributes("link").href as string | undefined;
    const nextUrl = window.prompt("Masukkan URL link", currentUrl ?? "https://");

    if (nextUrl === null) {
      return;
    }

    if (!nextUrl.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const normalizedUrl = /^https?:\/\//i.test(nextUrl) ? nextUrl : `https://${nextUrl}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href: normalizedUrl }).run();
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      {uploadError ? <Alert variant="error">{uploadError}</Alert> : null}
      {uploadMessage ? <Alert variant="success">{uploadMessage}</Alert> : null}

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <ToolbarButton
            active={editor.isActive("paragraph")}
            label="Paragraf"
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <Pilcrow className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("heading", { level: 2 })}
            label="Heading 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("heading", { level: 3 })}
            label="Heading 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("bold")}
            label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("italic")}
            label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("underline")}
            label="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("bulletList")}
            label="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("orderedList")}
            label="Ordered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("taskList")}
            label="Checklist"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <ListChecks className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("blockquote")}
            label="Quote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Divider"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("link")}
            label="Link"
            onClick={promptForLink}
          >
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Hapus format"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          >
            <RemoveFormatting className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            disabled={!editor.can().chain().focus().undo().run()}
            label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            disabled={!editor.can().chain().focus().redo().run()}
            label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>
          <Button
            className="ml-auto"
            onClick={() => fileInputRef.current?.click()}
            size="sm"
            variant="outline"
          >
            <ImagePlus className="h-4 w-4" />
            {uploading ? "Uploading..." : "Sisipkan Gambar"}
          </Button>
          <Button onClick={() => setShowLibrary((current) => !current)} size="sm" variant="outline">
            {showLibrary ? "Tutup Library" : "Pilih dari Library"}
          </Button>
        </div>

        <div className="mt-3 rounded-lg border border-dashed border-stone-300 bg-white px-3 py-3 text-xs leading-6 text-stone-500">
          Untuk list: klik tombol bullet atau checklist, lalu tekan <strong>Enter</strong> untuk item baru.
          Tekan <strong>Enter</strong> dua kali untuk keluar dari list.
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
          <div className="grid gap-2">
            <Label htmlFor="inline-image-label">Label gambar baru</Label>
            <Input
              id="inline-image-label"
              onChange={(event) => setAssetLabel(event.target.value)}
              placeholder="Ilustrasi artikel"
              value={assetLabel}
            />
          </div>
          <div className="flex items-end">
            <input
              accept="image/*"
              className="hidden"
              onChange={(event) => handleInlineUpload(event.target.files?.[0] ?? null)}
              ref={fileInputRef}
              type="file"
            />
            <Button
              disabled={!cloudinaryEnabled || uploading}
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <CloudUpload className="h-4 w-4" />
              Upload Gambar
            </Button>
          </div>
        </div>

        {showLibrary ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {assets.map((asset) => (
              <button
                className="overflow-hidden rounded-xl border border-stone-200 bg-white text-left transition hover:border-stone-300"
                key={asset.id}
                onClick={() =>
                  editor.chain().focus().setImage({ src: asset.secureUrl, alt: asset.label }).run()
                }
                type="button"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image alt={asset.label} className="object-cover" fill sizes="240px" src={asset.secureUrl} unoptimized />
                </div>
                <div className="px-3 py-3">
                  <p className="line-clamp-2 text-sm font-medium text-stone-900">{asset.label}</p>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
