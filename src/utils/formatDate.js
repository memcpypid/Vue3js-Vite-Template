/**
 * Format a date string to a human-readable format
 * @param {string} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date
    .toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
};
export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date
    .toLocaleDateString("id-ID", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
};
