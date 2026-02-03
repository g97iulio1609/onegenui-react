export const editableWrapperStyles = `
/* Editable wrapper styles */
.editable-wrapper {
  transition: box-shadow 0.15s;
}

.editable-wrapper--focused {
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
  border-radius: 4px;
}

/* Editable text node styles */
.editable-text-node {
  border-radius: 2px;
}

.editable-text-node--edit-mode {
  cursor: text;
}

.editable-text-node--edit-mode:hover {
  background-color: rgba(14, 165, 233, 0.08);
}

.editable-text-node--focused {
  background-color: rgba(14, 165, 233, 0.1);
}

.editable-text-node--active {
  background-color: rgba(14, 165, 233, 0.15);
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.3);
}

.editable-text-node--active:focus {
  outline: none;
}

/* Edit mode indicator */
.editable-indicator {
  animation: pulse-edit 2s infinite;
}

@keyframes pulse-edit {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* Mobile-specific styles */
@media (pointer: coarse) {
  .editable-text-node--edit-mode {
    /* Larger touch target on mobile */
    padding: 2px 4px;
    margin: -2px -4px;
  }
}
`;
