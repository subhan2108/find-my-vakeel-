'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * AdminLinkInserter — Universal hyperlink insert/edit/remove component
 * for the admin panel. Drop this once inside the admin layout and it
 * works on every <input> and <textarea> automatically on focus/selection.
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
    // Input types that don't support text selection/insertion
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

  /**
   * Position the floating toolbar at the top-right of the active element.
   */
  const positionToolbar = useCallback((el) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Approximate toolbar width is ~130px. Align to top-right corner.
    const toolbarWidth = 130;
    let top = rect.top + scrollTop - 38; // 38px above the element
    let left = rect.right + scrollLeft - toolbarWidth;

    // Clamp within viewport width
    const viewportWidth = window.innerWidth;
    if (left < 10) left = 10;
    if (left > viewportWidth - 150) left = viewportWidth - 150;
    
    // If pushed off the top of the screen, place inside or below
    if (rect.top < 50) {
      top = rect.top + scrollTop + 8;
    }

    setToolbarPos({ top, left });
  }, []);

  // ─── Event Handling ────────────────────────────────────────

  const checkState = useCallback(() => {
    const el = document.activeElement;
    if (!isAdminField(el)) return;

    activeFieldRef.current = el;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    selectionRangeRef.current = { start, end };

    const anchor = parseAnchorAtCursor(el.value, start);
    if (anchor) {
      setExistingTagRange(anchor);
      setIsEditing(true);
    } else {
      setExistingTagRange(null);
      setIsEditing(false);
    }
    setShowToolbar(true);
    positionToolbar(el);
  }, [isAdminField, parseAnchorAtCursor, positionToolbar]);

  // Sync toolbar position when viewport changes
  useEffect(() => {
    if (!showToolbar || !activeFieldRef.current) return;
    const handleUpdate = () => {
      if (activeFieldRef.current) {
        positionToolbar(activeFieldRef.current);
      }
    };
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [showToolbar, positionToolbar]);

  // Listen to focus, mouseup, keyup globally to track active element selection
  useEffect(() => {
    const onFocusIn = (e) => {
      if (isAdminField(e.target)) {
        setTimeout(checkState, 10);
      }
    };
    const onMouseUp = () => {
      setTimeout(checkState, 10);
    };
    const onKeyUp = (e) => {
      setTimeout(checkState, 10);
    };
    const onFocusOut = (e) => {
      setTimeout(() => {
        const active = document.activeElement;
        if (
          toolbarRef.current?.contains(active) ||
          modalRef.current?.contains(active)
        ) return;
        
        if (isAdminField(active)) {
          return; // Handled by next focusin
        }
        setShowToolbar(false);
      }, 150);
    };

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('focusout', onFocusOut, true);

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('focusout', onFocusOut, true);
    };
  }, [isAdminField, checkState]);

  // ─── Keyboard shortcut: Ctrl+K ─────────────────────────────

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        const el = document.activeElement;
        if (isAdminField(el)) {
          e.preventDefault();
          checkState();
          setTimeout(() => openModal(), 20);
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isAdminField, checkState]);

  // ─── Modal Logic ───────────────────────────────────────────

  const openModal = useCallback(() => {
    const el = activeFieldRef.current;
    if (!el) return;

    if (isEditing && existingTagRange) {
      setLinkText(existingTagRange.text);
      setLinkUrl(existingTagRange.href);
      setOpenInNewTab(existingTagRange.target === '_blank');
    } else {
      const { start, end } = selectionRangeRef.current;
      const selectedText = el.value.substring(start, end);
      setLinkText(selectedText || '');
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
    activeFieldRef.current?.focus();
  }, []);

  const insertLink = useCallback(() => {
    const el = activeFieldRef.current;
    if (!el || !linkUrl.trim()) return;

    const textToInsert = linkText.trim() || 'Link';
    const targetAttr = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const anchorTag = `<a href="${linkUrl.trim()}"${targetAttr}>${textToInsert}</a>`;

    const value = el.value;
    let newValue;

    if (isEditing && existingTagRange) {
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
      {/* Floating/Attached Toolbar */}
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
                <label htmlFor="admin-link-text-input">Anchor Text (Link Text)</label>
                <input
                  id="admin-link-text-input"
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. click here"
                  className="admin-link-input"
                  autoComplete="off"
                />
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
                    {`<a href="${linkUrl.trim()}"${openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${linkText.trim() || 'Link'}</a>`}
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

