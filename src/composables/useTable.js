import { ref } from "vue";

/**
 * Custom composable to handle standard BaseTable logic (Searching, Pagination, Refresh)
 * @param {Function} fetchCallback - Function that actually calls the API (with optional params)
 * @param {Object} options - Initial configuration and state overrides
 */
export function useTable(fetchCallback, options = {}) {
  // Use existing refs if passed (e.g. from Pinia store), otherwise create new ones
  const searchQuery = options.searchQuery || ref("");
  const startDate = options.startDate || ref("");
  const endDate = options.endDate || ref("");
  const sort = options.sort || ref("desc");
  const sortBy = options.sortBy || ref("created_at");
  const loading = options.loading || ref(false);
  const pagination =
    options.pagination ||
    ref({
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_previous: false,
    });

  let searchTimeout = null;

  const handleTable = async (action, value) => {
    let params = {};

    switch (action) {
      case "search":
        // Handle debounced search
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          pagination.value.page = 1;
          fetchCallback({ page: 1 });
        }, 500);
        return; // Callback is handled by timeout

      case "sort":
        // Toggle sort or set new sort_by
        if (sortBy.value === value) {
          sort.value = sort.value === "asc" ? "desc" : "asc";
        } else {
          sortBy.value = value;
          sort.value = "desc"; // Default to desc on new column
        }
        pagination.value.page = 1; // Reset to page 1 on sort change
        params = { page: 1 };
        break;

      case "fetch":
        // Reset to page 1 and fetch immediately (e.g. date filter update)
        pagination.value.page = 1;
        params = { page: 1 };
        break;

      case "reload":
        // Just reload current view
        params = {};
        break;

      case "limit":
        // Update limit and reset to page 1
        pagination.value.limit = value;
        pagination.value.page = 1;
        params = { limit: value, page: 1 };
        break;

      case "paginate":
        // Standard next/prev navigation
        if (value === "next" && pagination.value.has_next) {
          pagination.value.page += 1;
        } else if (value === "prev" && pagination.value.has_previous) {
          pagination.value.page -= 1;
        } else {
          return; // No-op
        }
        params = { page: pagination.value.page };
        break;
    }

    // Call the callback with calculated parameters
    return await fetchCallback(params);
  };

  return {
    searchQuery,
    startDate,
    endDate,
    sort,
    sortBy,
    pagination,
    loading,
    handleTable,
  };
}
