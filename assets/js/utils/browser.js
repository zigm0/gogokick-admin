/**
 * @param {string} title
 */
export function browserTitle(title) {
  document.title = title;
}

/**
 * @param {string} behavior
 */
export function browserScrollToTop(behavior = 'normal') {
  if (behavior !== 'normal') {
    window.scroll({
      left: 0,
      top:  0,
      behavior
    });
    return;
  }
  document.body.scrollTop = document.documentElement.scrollTop = 0; // eslint-disable-line
}

/**
 * @param {number|HTMLElement} top
 * @param {string|number} behavior
 * @param {string} rest
 */
export function browserScroll(top = 0, behavior = 'smooth', rest = 'smooth') {
  if (typeof top !== 'number' && typeof top !== 'string') {
    top.scroll({
      left:     0,
      top:      behavior,
      behavior: rest
    });
  } else {
    window.scroll({
      left: 0,
      top,
      behavior
    });
  }
}

/**
 *
 */
export function browserHideScrollbars() {
  // firefox, chrome
  document.documentElement.style.overflow = 'hidden';
  // ie only
  document.body.scroll = 'no';
}

/**
 *
 */
export function browserShowScrollbars() {
  // firefox, chrome
  document.documentElement.style.overflow = 'auto';
  // ie only
  document.body.scroll = 'yes';
}

/**
 * @param {HTMLElement} form
 */
export function browserSerializeForm(form) {
  const values = {};
  const { elements } = form;

  for (let i = 0; i < elements.length; i++) {
    const { name, value, type, checked } = elements[i];
    const isCheckbox = (type === 'checkbox' || type === 'radio');
    if (name && (!isCheckbox || (isCheckbox && checked))) {
      values[name] = value;
    }
  }

  return values;
}

/**
 * @param {EventTarget|HTMLElement} currentTarget
 * @returns {{name: string, value: *}}
 */
export function browserExtractFormValue(currentTarget) {
  const name = currentTarget.getAttribute('name');
  const tag  = currentTarget.tagName;

  let value = '';
  if (tag === 'SELECT') {
    value = currentTarget.options[currentTarget.selectedIndex].value;
  } else if (currentTarget.getAttribute('type') === 'checkbox') {
    value = currentTarget.checked ? 1 : 0;
  } else {
    value = currentTarget.value;
  }

  return {
    name,
    value
  }
}

/**
 * @param {string} key
 * @param {*} defaultValue
 * @returns {any}
 */
export function browserStorageGetItem(key, defaultValue = null) {
  let value = localStorage.getItem(key);
  if (!value) {
    return defaultValue;
  }

  return JSON.parse(value);
}

/**
 * @param {string} key
 * @param {*} value
 */
export function browserStorageSetItem(key, value) {
  if (typeof value === 'object') {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
}

/**
 * @param {string} key
 * @param {*} value
 */
export function browserStoragePushItem(key, value) {
  const current = browserStorageGetItem(key, []);
  current.push(value);
  browserStorageSetItem(key, current);

  return current;
}

/**
 * @param {HTMLIFrameElement} iframe
 * @returns {Document}
 */
export function browserIFrameDocument(iframe) {
  return iframe.contentDocument || iframe.contentWindow.document;
}

/**
 * @param {HTMLIFrameElement} iframe
 * @param {string} html
 */
export function browserIFrameSrc(iframe, html) {
  iframe.srcdoc = html;
}

/**
 * @param {HTMLElement|Node|EventTarget} element
 * @param {string} className
 * @returns {boolean}
 */
export function browserHasParentClass(element, className) {
  do {
    if (element.classList && element.classList.contains(className)) {
      return true;
    }
    element = element.parentNode;
  } while (element);

  return false;
}

/**
 *
 * @param {Node|HTMLElement} element
 * @param {string} tagName
 * @returns {boolean}
 */
export function browserHasParentTag(element, tagName) {
  do {
    if (element.tagName === tagName) {
      return true;
    }
    element = element.parentNode;
  } while (element);

  return false;
}

/**
 * @returns {Node}
 */
export function browserGetSelectedNode(isStart = true) {
  let range, sel, container;
  if (document.selection) {
    range = document.selection.createRange();
    range.collapse(isStart);

    return range.parentElement();
  } else {
    sel = window.getSelection();
    if (sel.getRangeAt) {
      if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
      }
    } else {
      // Old WebKit
      range = document.createRange();
      range.setStart(sel.anchorNode, sel.anchorOffset);
      range.setEnd(sel.focusNode, sel.focusOffset);

      // Handle the case when the selection was selected backwards (from the end to the start in the document)
      if (range.collapsed !== sel.isCollapsed) {
        range.setStart(sel.focusNode, sel.focusOffset);
        range.setEnd(sel.anchorNode, sel.anchorOffset);
      }
    }

    if (range) {
      container = range[isStart ? "startContainer" : "endContainer"];

      // Check if the container is a text node and return its parent if so
      return container.nodeType === 3 ? container.parentNode : container;
    }
  }
}

/**
 * @param {HTMLElement} el
 */
export function browserCaretAtEnd(el) {
  el.focus();
  if (typeof window.getSelection != "undefined"
    && typeof document.createRange != "undefined") {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
    const textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}

export default {
  title:            browserTitle,
  scroll:           browserScroll,
  scrollToTop:      browserScrollToTop,
  caretAtEnd:       browserCaretAtEnd,
  iframeDocument:   browserIFrameDocument,
  iframeSrc:        browserIFrameSrc,
  hideScrollbars:   browserHideScrollbars,
  showScrollbars:   browserShowScrollbars,
  serializeForm:    browserSerializeForm,
  extractFormValue: browserExtractFormValue,
  hasParentClass:   browserHasParentClass,
  hasParentTag:     browserHasParentTag,
  getSelectedNode:  browserGetSelectedNode,
  storage:          {
    getItem:  browserStorageGetItem,
    setItem:  browserStorageSetItem,
    pushItem: browserStoragePushItem
  }
};
