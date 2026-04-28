<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';
import * as z from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

const router = useRouter();
const authStore = useAuthStore();
const errorMsg = ref('');

const loginSchema = toTypedSchema(
  z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
);

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: loginSchema,
});

const [email, emailProps] = defineField('email');
const [password, passwordProps] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  errorMsg.value = '';
  try {
    await authStore.login(values);

    if (authStore.hasRole('admin')) {
      router.push('/admin/dashboard');
    } else {
      router.push('/user/dashboard');
    }
  } catch (error) {
    errorMsg.value = authStore.error || error.message || 'Login failed';
  }
});
</script>

<template>
  <div class="relative">
    <div class="absolute top-4 right-4">
      <ThemeToggle variant="ghost" />
    </div>

    <div class="p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p class="text-sm text-muted-foreground mt-2">Enter your credentials to access your account</p>
      </div>

      <form @submit="onSubmit" class="space-y-6">
        <div v-if="errorMsg" class="p-3 text-sm bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg">
          {{ errorMsg }}
        </div>

        <BaseInput id="email" v-model="email" v-bind="emailProps" type="email" label="Email"
          placeholder="admin@example.com or user@example.com" :error="errors.email" />

        <BaseInput id="password" v-model="password" v-bind="passwordProps" type="password" label="Password"
          placeholder="password" :error="errors.password" />

        <BaseButton type="submit" :loading="isSubmitting || authStore.loading.login" variant="primary" class="w-full">
          {{ isSubmitting || authStore.loading.login ? 'Signing in...' : 'Sign in' }}
        </BaseButton>
      </form>

      <div class="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?
        <router-link to="/register" class="font-medium text-primary hover:underline">Sign up</router-link>
      </div>

      <div class="mt-8 pt-6 border-t border-border">
        <p class="text-xs text-muted-foreground text-center mb-2">Demo Credentials</p>
        <div
          class="flex justify-center gap-4 text-xs font-mono bg-secondary p-3 rounded-lg overflow-x-auto text-secondary-foreground">
          <div>
            <b>Admin:</b><br />
            admin@mail.com
          </div>
          <div>
            <b>User:</b><br />
            user@mail.com
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
