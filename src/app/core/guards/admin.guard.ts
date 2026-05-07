import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const supabaseService = inject(SupabaseService);

  const user = await supabaseService.getCurrentUser();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const profile = await supabaseService.getUserProfile(user.id);

  if (profile?.role === 'admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
