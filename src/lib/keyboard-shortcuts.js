import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const modifier = e.ctrlKey || e.metaKey;
      const alt = e.altKey;
      const shift = e.shiftKey;

      // Create a string representation of the key combination
      const keyCombo = [
        modifier ? 'ctrl' : '',
        alt ? 'alt' : '',
        shift ? 'shift' : '',
        key
      ].filter(Boolean).join('+');

      // Find and execute the matching shortcut
      const handler = Object.entries(shortcuts).find(([combo]) => {
        return combo.toLowerCase() === keyCombo;
      })?.[1];

      if (handler) {
        e.preventDefault();
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Common shortcuts
export const COMMON_SHORTCUTS = {
  'ctrl+alt+r': () => console.log('Toggle real-time updates'),
  'ctrl+alt+s': () => console.log('Save dashboard'),
  'ctrl+alt+f': () => {
    const searchInput = document.querySelector('input[type="search"]');
    searchInput?.focus();
  },
  'f1': () => {
    // Show help modal
    console.log('Show help');
  },
  '?': (e) => {
    if (e.shiftKey) {
      console.log('Show help');
    }
  }
};
