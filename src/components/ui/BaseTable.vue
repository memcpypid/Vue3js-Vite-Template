<script setup>
import { ref, computed } from 'vue';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Calendar, X, ChevronUp, ChevronDown, Filter, AlertCircle } from 'lucide-vue-next';
import BaseButton from './BaseButton.vue';
import EmptyState from './EmptyState.vue';
import SkeletonTable from './SkeletonTable.vue';

const props = defineProps({
    headers: {
        type: Array, // Array of strings or { text: string, align: 'left' | 'center' | 'right' }
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    emptyMessage: {
        type: String,
        default: 'Tidak ada data ditemukan.'
    },
    // Controls Visibility
    showControls: { type: Boolean, default: true },
    showSearch: { type: Boolean, default: true },
    showLimit: { type: Boolean, default: true },
    showRefresh: { type: Boolean, default: true },
    showDateFilter: { type: Boolean, default: false },
    showPagination: { type: Boolean, default: true },
    // Control Values (v-model)
    searchQuery: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    searchPlaceholder: { type: String, default: 'Cari data...' },
    sort: { type: String, default: 'desc' },
    sortBy: { type: String, default: 'created_at' },
    // Pagination Metadata
    pagination: {
        type: Object,
        default: () => ({
            page: 1,
            limit: 10,
            total: 0,
            total_pages: 1,
            has_next: false,
            has_previous: false
        })
    }
});

const emit = defineEmits([
    'update:searchQuery',
    'update:startDate',
    'update:endDate',
    'search',
    'reload',
    'change-limit',
    'next-page',
    'prev-page',
    'sort'
]);

const showMobileFilters = ref(false);

const activeFilterCount = computed(() => {
    let count = 0;
    if (props.startDate) count++;
    if (props.endDate) count++;
    if (props.searchQuery) count++;
    return count;
});

const getAlignClass = (header) => {
    if (typeof header === 'string') return 'text-left';
    return `text-${header.align || 'left'}`;
};

const getHeaderText = (header) => {
    return typeof header === 'string' ? header : header.text;
};

// Handlers
const handleSearch = (e) => {
    emit('update:searchQuery', e.target.value);
    emit('search', e.target.value);
};

const handleSort = (header) => {
    if (header.sortable && header.value) {
        emit('sort', header.value);
    }
};

const handleLimitChange = (e) => {
    emit('change-limit', parseInt(e.target.value));
};

const clearDates = () => {
    emit('update:startDate', '');
    emit('update:endDate', '');
    emit('reload');
};

const resetAll = () => {
    emit('update:searchQuery', '');
    emit('update:startDate', '');
    emit('update:endDate', '');
    emit('reload');
    showMobileFilters.value = false;
};

const showingFrom = computed(() => {
    if (props.items.length === 0) return 0;
    return (props.pagination.page - 1) * (props.pagination.limit || 10) + 1;
});

const showingTo = computed(() => {
    return Math.min(props.pagination.page * (props.pagination.limit || 10), props.pagination.total);
});
</script>

<template>
    <div class="w-full space-y-6 transition-all duration-500">
        <!-- Card 1: Filter & Search Controls -->
        <div v-if="showControls"
            class="bg-card rounded-[28px] border border-border/50 shadow-sm overflow-hidden p-6 hover:border-primary/20 transition-all duration-300">
            <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">

                <!-- Left: Search & Info Section -->
                <div class="flex flex-1 items-center gap-3">
                    <!-- Search Input -->
                    <div v-if="showSearch" class="relative group flex-1 max-w-xl">
                        <div
                            class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-4 w-4 pointer-events-none">
                            <Search
                                class="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input :value="searchQuery" @input="handleSearch" type="text" :placeholder="searchPlaceholder"
                            class="h-12 w-full rounded-2xl border border-border bg-background/50 pl-11 pr-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground font-semibold" />
                    </div>

                    <!-- Date Filter Toggle (Mobile Only) -->
                    <button v-if="showDateFilter" @click="showMobileFilters = !showMobileFilters"
                        class="lg:hidden h-12 px-4 rounded-2xl border border-border bg-background flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 hover:border-primary/50"
                        :class="[showMobileFilters ? 'border-primary text-primary bg-primary/5 shadow-inner' : 'text-foreground/70']">
                        <Filter class="w-3.5 h-3.5" />
                        <span class="inline sm:inline">{{ showMobileFilters ? 'Tutup Filter' : 'Filter' }}</span>
                        <div v-if="activeFilterCount > 0"
                            class="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-black animate-pulse">
                            {{ activeFilterCount }}
                        </div>
                    </button>
                </div>

                <!-- Right: Actions Section -->
                <div class="flex items-center gap-2.5 self-end md:self-auto">
                    <!-- Clear All Button -->
                    <transition enter-active-class="transition duration-300 ease-out"
                        enter-from-class="opacity-0 scale-90 translate-x-2"
                        enter-to-class="opacity-100 scale-100 translate-x-0">
                        <button v-if="activeFilterCount > 0" @click="resetAll"
                            class="h-12 px-4 inline-flex justify-center items-center gap-2 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 group font-black text-[10px] uppercase tracking-widest">
                            <X class="w-3.5 h-3.5" />
                            <span class="hidden lg:inline">Reset</span>
                        </button>
                    </transition>

                    <!-- Limit Selector (Moved to Header) -->
                    <div v-if="showLimit"
                        class="relative h-12 flex items-center bg-secondary/30 border border-border/50 rounded-2xl hover:border-primary/30 transition-all group/limit overflow-hidden">
                        <!-- The actual clickable select (Invisible but covers everything) -->
                        <select :value="pagination.limit || 10" @change="handleLimitChange"
                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 appearance-none">
                            <option :value="5" class="bg-card text-foreground">5</option>
                            <option :value="10" class="bg-card text-foreground">10</option>
                            <option :value="25" class="bg-card text-foreground">25</option>
                            <option :value="50" class="bg-card text-foreground">50</option>
                        </select>

                        <!-- The visible UI (Pointer events disabled to let clicks pass through to select) -->
                        <div
                            class="flex items-center gap-3 px-4 w-full justify-between pointer-events-none relative z-0">
                            <div class="flex items-center gap-2">
                                <span
                                    class="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover/limit:text-primary transition-colors">Limit</span>
                                <span class="text-[11px] font-black uppercase tracking-widest text-foreground">{{
                                    pagination.limit || 10 }}</span>
                            </div>
                            <ChevronDown
                                class="w-3.5 h-3.5 text-muted-foreground/40 group-hover/limit:text-primary transition-colors" />
                        </div>
                    </div>

                    <!-- Refresh Button -->
                    <button v-if="showRefresh" @click="$emit('reload')"
                        class="h-12 w-12 inline-flex justify-center items-center bg-secondary/50 text-foreground rounded-2xl border border-border hover:bg-secondary transition-all hover:scale-105 active:scale-95 shadow-sm group"
                        title="Muat Ulang Data">
                        <RefreshCw class="w-4 h-4 group-hover:rotate-180 transition-transform duration-700"
                            :class="{ 'animate-spin': loading }" />
                    </button>
                </div>
            </div>

            <!-- Date Filters Panel (Expandable) -->
            <transition enter-active-class="transition-all duration-500 ease-out"
                enter-from-class="max-h-0 opacity-0 overflow-hidden" enter-to-class="max-h-[500px] opacity-100"
                leave-active-class="transition-all duration-400 ease-in" leave-from-class="max-h-[500px] opacity-100"
                leave-to-class="max-h-0 opacity-0 overflow-hidden">
                <div v-if="showDateFilter && (showMobileFilters || !$attrs.class?.includes('lg:hidden'))"
                    class="mt-6 p-6 rounded-[24px] bg-secondary/30 border border-border/50 lg:flex items-center gap-6"
                    :class="{ 'hidden lg:flex': !showMobileFilters }">

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:flex items-center gap-6 w-full">
                        <div class="flex-1 space-y-2">
                            <label
                                class="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2 lg:block">Dari
                                Tanggal</label>
                            <div class="relative group">
                                <Calendar
                                    class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                                <input type="date" @click="e => e.target.showPicker()" :value="startDate"
                                    @input="e => $emit('update:startDate', e.target.value)"
                                    class="cursor-pointer h-12 w-full lg:w-52 pl-12 pr-4 rounded-2xl border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner" />
                            </div>
                        </div>

                        <div
                            class="hidden lg:flex items-center justify-center p-2 rounded-full border border-border bg-background mt-6">
                            <ChevronRight class="w-4 h-4 text-muted-foreground/40" />
                        </div>

                        <div class="flex-1 space-y-2">
                            <label
                                class="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2 lg:block">Sampai
                                Tanggal</label>
                            <div class="relative group">
                                <Calendar
                                    class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                                <input type="date" @click="e => e.target.showPicker()" :value="endDate"
                                    @input="e => $emit('update:endDate', e.target.value)"
                                    class="cursor-pointer h-12 w-full lg:w-52 pl-12 pr-4 rounded-2xl border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner" />
                            </div>
                        </div>

                        <div v-if="showMobileFilters" class="mt-4 lg:hidden">
                            <BaseButton variant="primary" fullWidth size="md" @click="showMobileFilters = false"
                                class="rounded-2xl">
                                Terapkan Filter
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </transition>
        </div>

        <!-- Card 2: Main Data & Results -->
        <div class="bg-card rounded-[28px] border border-border/50 shadow-sm overflow-hidden flex flex-col group/table">
            <!-- Sorting Guide Bar -->
            <div class="flex items-center justify-start px-8 py-3 bg-muted/30 border-b border-border/30">
                <div
                    class="flex items-center gap-2.5 text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] leading-none">
                    <AlertCircle class="w-3.5 h-3.5 text-primary opacity-60" />
                    <span>Klik Kolom Data Terpilih Untuk Mengurutkan Urutan Data</span>
                </div>
            </div>

            <!-- Desktop Table Content -->
            <div class="hidden lg:block overflow-x-auto flex-1">
                <table class="w-full text-sm text-left border-separate border-spacing-0">
                    <thead
                        class="text-[10px] font-heading font-black tracking-[0.2em] uppercase text-muted-foreground border-b-2 border-border bg-secondary/20">
                        <tr>
                            <th v-for="(header, index) in headers" :key="index" :class="[
                                'px-8 py-6 transition-all border-b border-border/50',
                                getAlignClass(header),
                                header.sortable ? 'cursor-pointer hover:bg-primary/5 select-none text-primary/80 group-hover:text-primary' : ''
                            ]" @click="handleSort(header)">
                                <div class="flex items-center gap-2.5"
                                    :class="{ 'justify-center': header.align === 'center', 'justify-end': header.align === 'right' }">
                                    {{ getHeaderText(header) }}
                                    <div v-if="header.sortable"
                                        class="flex flex-col text-muted-foreground/30 group-hover:text-primary/40">
                                        <ChevronUp class="w-3 h-3 transition-colors"
                                            :class="{ 'text-primary scale-110': sortBy === header.value && sort === 'asc' }" />
                                        <ChevronDown class="w-3 h-3 -mt-1 transition-colors"
                                            :class="{ 'text-primary scale-110': sortBy === header.value && sort === 'desc' }" />
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/30">
                        <tr v-if="loading">
                            <td :colspan="headers.length" class="px-8 py-10">
                                <SkeletonTable :rows="pagination.limit || 5" :columns="headers.length" />
                            </td>
                        </tr>
                        <tr v-else-if="items.length === 0">
                            <td :colspan="headers.length" class="px-6 py-20">
                                <EmptyState :title="emptyMessage" @action="resetAll" :showAction="activeFilterCount > 0">
                                    <template #icon>
                                        <Search class="w-10 h-10 text-muted-foreground/30" />
                                    </template>
                                </EmptyState>
                            </td>
                        </tr>
                        <tr v-else v-for="(item, itemIndex) in items" :key="itemIndex"
                            class="group/row hover:bg-primary/2 transition-all duration-300">
                            <slot name="row" :item="item" :index="itemIndex"></slot>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Mobile Card Content -->
            <div class="lg:hidden flex-1 divide-y divide-border/20 overflow-y-auto">
                <div v-if="loading" class="p-10">
                    <SkeletonTable :rows="3" :columns="1" />
                </div>
                <div v-else-if="items.length === 0" class="p-10">
                    <EmptyState :title="emptyMessage" @action="resetAll" :showAction="activeFilterCount > 0">
                        <template #icon>
                            <Search class="w-10 h-10 text-muted-foreground/30" />
                        </template>
                    </EmptyState>
                </div>
                <div v-else v-for="(item, itemIndex) in items" :key="itemIndex"
                    class="p-6 space-y-5 hover:bg-primary/2 transition-all duration-300">
                    <slot name="mobile-row" :item="item" :index="itemIndex">
                        <div v-for="(header, hIndex) in headers" :key="hIndex" class="flex flex-col gap-1.5">
                            <span
                                class="text-[8px] font-heading font-black text-muted-foreground/50 uppercase tracking-widest leading-none">
                                {{ getHeaderText(header) }}
                            </span>
                            <div class="text-xs font-bold text-foreground/80">
                                <slot :name="'cell-' + (header.value || hIndex)" :item="item">
                                    {{ item[header.value] || '-' }}
                                </slot>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>

        </div>

        <!-- Card 3: Pagination Footer -->
        <div v-if="showPagination && (loading || pagination.total > 0)"
            class="bg-card rounded-[28px] border border-border/50 shadow-sm overflow-hidden p-6 hover:border-primary/20 transition-all duration-300">
            <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
                <!-- Left: Results Stats Section -->
                <div class="flex flex-wrap items-center gap-4 max-lg:justify-center">
                    <div
                        class="flex items-center gap-3.5 px-5 py-2.5 bg-primary/5 border border-primary/10 rounded-2xl shadow-inner group/stats hover:border-primary/30 transition-colors">
                        <div
                            class="flex items-center justify-center w-6 h-6 rounded-xl bg-primary/10 text-primary shadow-sm group-hover/stats:scale-110 transition-transform">
                            <Search class="w-3.5 h-3.5" />
                        </div>
                        <p
                            class="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                            Menampilkan
                            <span class="text-primary font-black mx-1 tracking-normal text-xs">{{ showingFrom }}</span>
                            —
                            <span class="text-primary font-black mx-1 tracking-normal text-xs">{{ showingTo }}</span>
                            dari <span class="text-foreground ml-1 font-black text-xs tracking-normal">{{
                                pagination.total }}</span> Hasil
                        </p>
                    </div>

                </div>

                <!-- Right: Pagination Controls Section -->
                <div class="flex items-center gap-6">
                    <button @click="$emit('prev-page')" :disabled="!pagination.has_previous || loading"
                        class="group flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground hover:bg-primary hover:text-white hover:border-primary disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed transition-all duration-300 shadow-sm active:scale-90"
                        title="Halaman Sebelumnya">
                        <ChevronLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div class="flex flex-col items-center">
                        <span
                            class="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-none mb-2">Navigasi
                            Tabulasi</span>
                        <div
                            class="flex items-center gap-3 px-5 py-2 bg-background/50 border border-border shadow-inner rounded-2xl">
                            <span
                                class="text-[10px] font-black text-foreground/60 uppercase tracking-tight">Halaman</span>
                            <div class="flex items-center justify-center min-w-[28px] h-7 px-2 rounded-xl bg-primary text-white text-[11px] font-black shadow-lg shadow-primary/20 scale-110 mx-1 transition-all"
                                :class="{ 'animate-pulse opacity-70': loading }">
                                {{ pagination.page }}
                            </div>
                            <span
                                class="text-[10px] font-black text-muted-foreground/40 uppercase tracking-tight">dari</span>
                            <span class="text-[11px] font-black text-foreground tracking-tight">{{
                                pagination.total_pages }}</span>
                        </div>
                    </div>

                    <button @click="$emit('next-page')" :disabled="!pagination.has_next || loading"
                        class="group flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground hover:bg-primary hover:text-white hover:border-primary disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed transition-all duration-300 shadow-sm active:scale-90"
                        title="Halaman Selanjutnya">
                        <ChevronRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 10px;
}
</style>