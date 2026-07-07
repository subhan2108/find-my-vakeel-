'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * AdminLinkInserter — Universal hyperlink insert/edit/remove component
 * for the admin panel. Drop this once inside the admin layout and it
 * works on every <input> and <textarea> automatically.
 */
export default function AdminLinkInserter() {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
  const [showModal, setShowModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingTagRange, setExistingTagRange] = useState(null);

  // Refs to track the active field and selection
  const activeFieldRef = useRef(null);
  const selectionRangeRef = useRef({ start: 0, end: 0 });
  const toolbarRef = useRef(null);
  const modalRef = useRef(null);
  const urlInputRef = useRef(null);

  // ─── Helpers ───────────────────────────────────────────────

  /**
   * Check if the admin panel container is an ancestor of the element.
   * We scope to inputs/textareas inside the admin page only.
   */
  const isAdminField = useCallback((el) => {
    if (!el) return false;
    const tag = el.tagName;
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') return false;
    // Input types that don't support text selection
    if (tag === 'INPUT' && !['text', 'url', 'search', 'tel', 'password'].includes(el.type)) return false;
    // Must be inside the admin page
    return !!el.closest('main');
  }, []);

  /**
   * Parse anchor tag at the cursor position within the field value.
   * Returns { fullMatch, href, text, target, start, end } or null.
   */
  const parseAnchorAtCursor = useCallback((value, cursorPos) => {
    // Find all <a ...>...</a> in the value
    const regex = /<a\s+([^>]*?)>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = regex.exec(value)) !== null) {
      const tagStart = match.index;
      const tagEnd = match.index + match[0].length;
      if (cursorPos >= tagStart && cursorPos <= tagEnd) {
        // Extract href
        const hrefMatch = match[1].match(/href=["']([^"']*)["']/i);
        const targetMatch = match[1].match(/target=["']([^"']*)["']/i);
        return {
          fullMatch: match[0],
          href: hrefMatch ? hrefMatch[1] : '',
          text: match[2],
          target: targetMatch ? targetMatch[1] : '',
          start: tagStart,
          end: tagEnd
        };
      }
    }
    return null;
  }, []);

  /**
   * Trigger React's onChange on a controlled input/textarea by using
   * the native value setter then dispatching an input event.
   */
  const setNativeValue = useCallback((el, value) => {
    const proto = el.tagName === 'TEXTAREA'
      ? Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')
      : Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (proto && proto.set) {
      proto.set.call(el, value);
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, []);

  // ─── Selection Tracking ────────────────────────────────────

  const handleSelectionChange = useCallback(() => {
    const el = document.activeElement;
    if (!isAdminField(el)) {
      setShowToolbar(false);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;

    if (start === end) {
      // No selection — check if cursor is inside an existing link
      const anchor = parseAnchorAtCursor(el.value, start);
      if (anchor) {
        activeFieldRef.current = el;
        selectionRangeRef.current = { start, end };
        setExistingTagRange(anchor);
        setShowToolbar(true);
        setIsEditing(true);
        positionToolbar(el, anchor.start, anchor.end);
      } else {
        setShowToolbar(false);
        setIsEditing(false);
        setExistingTagRange(null);
      }
      return;
    }

    // There is a text selection
    activeFieldRef.current = el;
    selectionRangeRef.current = { start, end };
    setShowToolbar(true);
    setIsEditing(false);
    setExistingTagRange(null);
    positionToolbar(el, start, end);
  }, [isAdminField, parseAnchorAtCursor]);

  /**
   * Position the floating toolbar near the selected text.
   * For inputs/textareas we approximate using the element's bounding rect.
   */
  const positionToolbar = useCallback((el, selStart, selEnd) => {
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Create a temporary span to measure text offset (approximation)
    const textBeforeSelection = el.value.substring(0, selStart);
    const lines = textBeforeSelection.split('\n');
    const lineIndex = lines.length - 1;
    const charIndex = lines[lineIndex].length;

    // Approximate character width (for monospace ~7.5px, proportional ~6.5px)
    const computedStyle = window.getComputedStyle(el);
    const fontSize = parseFloat(computedStyle.fontSize) || 14;
    const isMonospace = computedStyle.fontFamily.toLowerCase().includes('mono');
    const charWidth = isMonospace ? fontSize * 0.6 : fontSize * 0.5;
    const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize * 1.5;

    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;

    let top = rect.top + scrollTop + paddingTop + (lineIndex * lineHeight) - 44;
    let left = rect.left + scrollLeft + paddingLeft + (charIndex * charWidth);

    // Clamp within viewport
    const viewportWidth = window.innerWidth;
    if (left < 10) left = 10;
    if (left > viewportWidth - 200) left = viewportWidth - 200;
    if (top < scrollTop + 10) top = rect.top + scrollTop + paddingTop + ((lineIndex + 1) * lineHeight) + 8;

    setToolbarPos({ top, left });
  }, []);

  useEffect(() => {
    const onMouseUp = () => {
      // Small delay to let the browser finalize the selection
      setTimeout(handleSelectionChange, 10);
    };
    const onKeyUp = (e) => {
      // Track selection changes via keyboard (Shift+Arrow, Ctrl+A, etc.)
      if (e.shiftKey || e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        setTimeout(handleSelectionChange, 10);
      }
      // Also check cursor position for existing link detection
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
        setTimeout(handleSelectionChange, 10);
      }
    };
    const onFocusOut = (e) => {
      // Don't hide toolbar if clicking on the toolbar/modal itself
      setTimeout(() => {
        const active = document.activeElement;
        if (
          toolbarRef.current?.contains(active) ||
          modalRef.current?.contains(active)
        ) return;
        setShowToolbar(false);
      }, 150);
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('focusout', onFocusOut, true);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('focusout', onFocusOut, true);
    };
  }, [handleSelectionChange]);

  // ─── Keyboard shortcut: Ctrl+K ─────────────────────────────

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        const el = document.activeElement;
        if (isAdminField(el)) {
          e.preventDefault();
          handleSelectionChange();
          // If toolbar is showing, open modal
          setTimeout(() => openModal(), 20);
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isAdminField, handleSelectionChange]);

  // ─── Modal Logic ───────────────────────────────────────────

  const openModal = useCallback(() => {
    const el = activeFieldRef.current;
    if (!el) return;

    if (isEditing && existingTagRange) {
      // Pre-fill with existing link data
      setLinkText(existingTagRange.text);
      setLinkUrl(existingTagRange.href);
      setOpenInNewTab(existingTagRange.target === '_blank');
    } else {
      const { start, end } = selectionRangeRef.current;
      const selectedText = el.value.substring(start, end);
      if (!selectedText && !isEditing) return; // Nothing selected
      setLinkText(selectedText);
      setLinkUrl('');
      setOpenInNewTab(false);
    }

    setShowModal(true);
    setShowToolbar(false);

    // Focus URL input after modal renders
    setTimeout(() => urlInputRef.current?.focus(), 50);
  }, [isEditing, existingTagRange]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setLinkUrl('');
    setLinkText('');
    setOpenInNewTab(false);
    setIsEditing(false);
    setExistingTagRange(null);
    // Refocus the original field
    activeFieldRef.current?.focus();
  }, []);

  const insertLink = useCallback(() => {
    const el = activeFieldRef.current;
    if (!el || !linkUrl.trim()) return;

    const targetAttr = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const anchorTag = `<a href="${linkUrl.trim()}"${targetAttr}>${linkText}</a>`;

    const value = el.value;
    let newValue;

    if (isEditing && existingTagRange) {
      // Replace the existing anchor tag
      newValue = value.substring(0, existingTagRange.start) + anchorTag + value.substring(existingTagRange.end);
    } else {
      const { start, end } = selectionRangeRef.current;
      newValue = value.substring(0, start) + anchorTag + value.substring(end);
    }

    setNativeValue(el, newValue);
    closeModal();
  }, [linkUrl, linkText, openInNewTab, isEditing, existingTagRange, setNativeValue, closeModal]);

  const removeLink = useCallback(() => {
    const el = activeFieldRef.current;
    if (!el || !existingTagRange) return;

    const value = el.value;
    // Replace the full anchor tag with just its inner text
    const newValue = value.substring(0, existingTagRange.start) + existingTagRange.text + value.substring(existingTagRange.end);

    setNativeValue(el, newValue);
    closeModal();
  }, [existingTagRange, setNativeValue, closeModal]);

  const handleModalKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      insertLink();
    }
    if (e.key === 'Escape') {
      closeModal();
    }
  }, [insertLink, closeModal]);

  // ─── Render ────────────────────────────────────────────────

  return (
    <>
      {/* Floating Toolbar */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          className="admin-link-toolbar"
          style={{ top: `${toolbarPos.top}px`, left: `${toolbarPos.left}px` }}
        >
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={openModal}
                className="admin-link-toolbar-btn"
                title="Edit Link (Ctrl+K)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>Edit Link</span>
              </button>
              <button
                type="button"
                onClick={removeLink}
                className="admin-link-toolbar-btn admin-link-toolbar-btn--danger"
                title="Remove Link"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                <span>Unlink</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={openModal}
              className="admin-link-toolbar-btn"
              title="Insert Link (Ctrl+K)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>Insert Link</span>
            </button>
          )}
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div className="admin-link-modal-backdrop" onClick={closeModal}>
          <div
            ref={modalRef}
            className="admin-link-modal"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleModalKeyDown}
          >
            {/* Modal Header */}
            <div className="admin-link-modal-header">
              <div className="admin-link-modal-header-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <h3>{isEditing ? 'Edit Hyperlink' : 'Insert Hyperlink'}</h3>
              <button type="button" onClick={closeModal} className="admin-link-modal-close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="admin-link-modal-body">
              <div className="admin-link-field">
                <label>Selected Text</label>
                <div className="admin-link-selected-text">{linkText || '(no text selected)'}</div>
              </div>

              <div className="admin-link-field">
                <label htmlFor="admin-link-url-input">URL</label>
                <input
                  ref={urlInputRef}
                  id="admin-link-url-input"
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://findmyvakeel.com/blog/..."
                  className="admin-link-input"
                  autoComplete="off"
                />
              </div>

              <div className="admin-link-field admin-link-checkbox-field">
                <label className="admin-link-checkbox-label">
                  <input
                    type="checkbox"
                    checked={openInNewTab}
                    onChange={(e) => setOpenInNewTab(e.target.checked)}
                  />
                  <span className="admin-link-checkbox-custom"></span>
                  <span>Open in new tab</span>
                </label>
                <span className="admin-link-hint">Adds target=&quot;_blank&quot; and rel=&quot;noopener noreferrer&quot;</span>
              </div>

              {/* Preview */}
              {linkUrl.trim() && (
                <div className="admin-link-preview">
                  <label>Preview</label>
                  <code className="admin-link-preview-code">
                    {`<a href="${linkUrl.trim()}"${openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${linkText}</a>`}
                  </code>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="admin-link-modal-footer">
              {isEditing && (
                <button
                  type="button"
                  onClick={removeLink}
                  className="admin-link-btn admin-link-btn--danger"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Remove Link
                </button>
              )}
              <div className="admin-link-modal-footer-right">
                <button type="button" onClick={closeModal} className="admin-link-btn admin-link-btn--secondary">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertLink}
                  disabled={!linkUrl.trim()}
                  className="admin-link-btn admin-link-btn--primary"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  {isEditing ? 'Update Link' : 'Insert Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
