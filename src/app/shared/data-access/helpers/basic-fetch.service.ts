import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../ui/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BasicFetchService {
  private _toastr = inject(ToastrService);
  private _authService = inject(AuthService);
  private dialog = inject(MatDialog);

  async create<T>(
    value: any,
    url: string,
    errorMessage: string = 'Unknown error occurred'
  ): Promise<T | null> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(value),
        headers: await this._authService.getAuthHeaderAsync(),
      });

      if (!response.ok) {
        throw new Error(errorMessage);
      }

      this._toastr.success('Successfully created');
      return await response.json();
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return null;
    }
  }

  async delete(
    url: string,
    errorMessage: string = 'Unknown error occurred'
  ): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete?',
      },
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result === 'confirm') {
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: await this._authService.getAuthHeaderAsync(),
        });

        if (!response.ok) {
          throw new Error(errorMessage);
        }

        this._toastr.success('Successfully deleted');
        return true;
      } catch (error: Error | any) {
        this._toastr.error(error.message, 'Error');
        return false;
      }
    } else {
      return false;
    }
  }

  async update<T>(
    value: T,
    url: string,
    errorMessage: string = 'Unknown error occurred'
  ): Promise<T | null> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(value),
        headers: await this._authService.getAuthHeaderAsync(),
      });

      if (!response.ok) {
        throw new Error(errorMessage);
      }

      this._toastr.success('Successfully updated');
      return await response.json();
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return null;
    }
  }
}
