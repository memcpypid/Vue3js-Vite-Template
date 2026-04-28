<script setup>
import { computed } from 'vue';
import {
  Clock, ClipboardList, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-vue-next';

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  class: {
    type: String,
    default: ''
  }
});

const statusMap = {
  Pending: {
    label: 'Menunggu',
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30'
  },
  InReview: {
    label: 'Ditinjau',
    icon: ClipboardList,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30'
  },
  RevisionRequired: {
    label: 'Perlu Revisi',
    icon: AlertTriangle,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30'
  },
  Approved: {
    label: 'Disetujui',
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30'
  },
  Rejected: {
    label: 'Ditolak',
    icon: XCircle,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-950/30'
  },
  Verified: {
    label: 'Terverifikasi',
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-950/30'
  },
  Unverified: {
    label: 'Belum Aktif',
    icon: XCircle,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-950/30'
  },
  Active: {
    label: 'Aktif',
    icon: CheckCircle2,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-950/30'
  }
};

const config = computed(() => statusMap[props.status] || {
  label: props.status,
  icon: Clock,
  color: 'text-muted-foreground',
  bg: 'bg-secondary'
});
</script>

<template>
  <span :class="[
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading font-black tracking-widest uppercase border border-current/20',
    config.bg,
    config.color,
    props.class
  ]">
    <component :is="config.icon" class="w-3 h-3" />
    {{ config.label }}
  </span>
</template>