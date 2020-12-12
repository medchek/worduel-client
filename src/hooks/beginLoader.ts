import { ref } from "vue";

export default function useBeginBtnLoader() {
  const isLoading = ref(false);

  function setIsLoading() {
    if (isLoading.value) return;
    isLoading.value = true;
  }

  function setIsNotLoading() {
    if (!isLoading.value) return;
    isLoading.value = false;
  }

  return {
    isLoading,
    setIsLoading,
    setIsNotLoading,
  };
}
