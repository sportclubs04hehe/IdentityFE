import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';
import { SharedService } from '../shared.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../models/user';

export const authorizationGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const sharedService = inject(SharedService);
  const router = inject(Router);
  
  return accountService.user$.pipe(
    map((user: User | null) => {
      if (user) {
        return true;
      } else {
        sharedService.showNotification(false, 'Khu vực hạn chế', 'Rời đi ngay lập tức!');
        router.navigate(['account/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );

};
