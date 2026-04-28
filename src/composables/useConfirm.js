import { ref } from 'vue';

/**
 * Composable to handle Confirmation Modal logic
 */
export function useConfirm() {
  const isConfirmModalOpen = ref(false);
  const isProcessingAction = ref(false);
  const confirmModalConfig = ref({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    type: 'danger',
    confirmText: 'Confirm'
  });
  
  let onConfirmCallback = null;

  const openConfirm = (config, callback) => {
    confirmModalConfig.value = {
      title: config.title || 'Confirm Action',
      message: config.message || 'Are you sure?',
      type: config.type || 'danger',
      confirmText: config.confirmText || 'Confirm'
    };
    onConfirmCallback = callback;
    isConfirmModalOpen.value = true;
  };

  const handleConfirm = async () => {
    if (onConfirmCallback) {
      isProcessingAction.value = true;
      try {
        await onConfirmCallback();
        isConfirmModalOpen.value = false;
      } finally {
        isProcessingAction.value = false;
      }
    }
  };

  const closeConfirm = () => {
    isConfirmModalOpen.value = false;
  };

  return {
    isConfirmModalOpen,
    isProcessingAction,
    confirmModalConfig,
    openConfirm,
    handleConfirm,
    closeConfirm
  };
}
