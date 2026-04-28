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

const registerSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
);

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: registerSchema,
});

const [name, nameProps] = defineField('name');
const [email, emailProps] = defineField('email');
const [password, passwordProps] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  errorMsg.value = '';
  try {
    const payload = {
      ...values,
      role: 'user' // default role
    };
    await authStore.register(payload);
    router.push('/login');
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message || 'Registration failed';
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
        <h1 class="text-2xl font-bold tracking-tight text-foreground">Create an account</h1>
        <p class="text-sm text-muted-foreground mt-2">Enter your details below to create your account</p>
      </div>

      <form @submit="onSubmit" class="space-y-6">
        <div v-if="errorMsg" class="p-3 text-sm bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg">
          {{ errorMsg }}
        </div>

        <BaseInput 
          id="name" 
          v-model="name" 
          v-bind="nameProps"
          type="text" 
          label="Full Name" 
          placeholder="John Doe" 
          :error="errors.name"
        />

        <BaseInput 
          id="email" 
          v-model="email" 
          v-bind="emailProps"
          type="email" 
          label="Email" 
          placeholder="m@example.com" 
          :error="errors.email"
        />

        <BaseInput 
          id="password" 
          v-model="password" 
          v-bind="passwordProps"
          type="password" 
          label="Password" 
          placeholder="Minimum 6 characters" 
          :error="errors.password"
        />

        <BaseButton type="submit" :loading="isSubmitting || authStore.loading.register" variant="primary" class="w-full">
          Create Account
        </BaseButton>
      </form>

      <div class="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?
        <router-link to="/login" class="font-medium text-primary hover:underline">Sign in</router-link>
      </div>
    </div>
  </div>
</template>
