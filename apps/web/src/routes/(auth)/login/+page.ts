import { superValidate } from 'sveltekit-superforms';
import { loginSchema } from '@maximecd/schemas';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
  const form = await superValidate(zod(loginSchema));

  return {
    form,
  };
};
