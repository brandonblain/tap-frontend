import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);
  public auth = inject(AuthService);

  public users = signal<any[]>([]);
  public availableProfiles = signal<any[]>([]);
  public isLoading = signal<boolean>(true);
  public isSaving = signal<boolean>(false);
  public isModalOpen = signal<boolean>(false);
  public isEditing = signal<boolean>(false);
  public isDeleteModalOpen = signal<boolean>(false);

  public currentUserId: string | null = null;
  public userToDelete = signal<any>(null);
  public userForm!: FormGroup;
  
  public base64Image: string = '';

  ngOnInit(): void {
    this.initForm();
    this.loadProfiles();
    this.loadUsers();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      code: [''],
      name: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      profile_ids: [[], [Validators.required]],
      profile_picture: ['']
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => { this.users.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  loadProfiles(): void {
    this.profileService.getProfiles().subscribe({
      next: (data) => this.availableProfiles.set(data)
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result as string; 
      };
      reader.readAsDataURL(file);
    }
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.currentUserId = null;
    this.base64Image = '';
    this.userForm.reset();
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.isModalOpen.set(true);
  }

 openEditModal(user: any): void {
    this.isEditing.set(true);
    this.currentUserId = user.id;
    this.base64Image = '';
    
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();

    this.userService.getUserById(user.id).subscribe({
      next: (fullUserData: any) => {
        const userData = fullUserData.user || fullUserData; 

        this.userForm.patchValue({
          code: userData.code,
          name: userData.name,
          username: userData.username,
          password: '',
          phone: userData.phone || '',
          profile_ids: userData.profile_ids || [],
          profile_picture: userData.profile_picture || ''
        });
        this.isModalOpen.set(true);
      },
      error: () => {
        alert('No se pudo obtener el detalle extendido del usuario.');
      }
    });
  }

  closeModal(): void { this.isModalOpen.set(false); }

  onSave(): void {
    if (this.userForm.invalid) return;
    this.isSaving.set(true);

    const formRaw = this.userForm.getRawValue();
    
    const payload: any = {
      name: formRaw.name,
      username: formRaw.username,
      phone: formRaw.phone || null,
      profile_ids: formRaw.profile_ids,
    };

    if (this.base64Image) {
      payload.profile_picture = this.base64Image; //
    }

    if (formRaw.password) {
      payload.password = formRaw.password;
    }

    if (this.isEditing() && this.currentUserId) {
      this.userService.updateUser(this.currentUserId, payload).subscribe({
        next: (response: any) => {
          const updatedUser = response.user; 
          if (updatedUser) {
            this.users.update(prev => 
              prev.map(u => u.id === this.currentUserId ? {
                ...u,
                name: updatedUser.name,
                username: updatedUser.username,
                phone: updatedUser.phone || 'N/A',
                profile_picture: this.base64Image ? this.base64Image : updatedUser.profile_picture,
                profile_ids: updatedUser.profile_ids || []
              } : u)
            );
          } else {
            this.loadUsers();
          }
          this.isSaving.set(false);
          this.closeModal();
        },
        error: () => {
          alert('Error al actualizar el usuario.');
          this.isSaving.set(false);
        }
      });

    } else {
      this.userService.createUser(payload).subscribe({
        next: (response: any) => {
          const newUser = response.user;
          
          if (newUser) {
            const mappedNewUser = {
              id: newUser.id || newUser._id,
              code: newUser.code,
              name: newUser.name,
              username: newUser.username,
              phone: newUser.phone || 'N/A',
              profile_picture: this.base64Image || newUser.profile_picture,
              profile_ids: newUser.profile_ids || [],
              created_at: newUser.created_at ? new Date(newUser.created_at).toLocaleDateString() : new Date().toLocaleDateString()
            };
            this.users.update(prev => [mappedNewUser, ...prev]);
          } else {
            this.loadUsers();
          }

          this.isSaving.set(false);
          this.closeModal();
        },
        error: () => {
          alert('Error al registrar el nuevo usuario.');
          this.isSaving.set(false);
        }
      });
    }
  }

  openDeleteModal(user: any): void {
    this.userToDelete.set(user);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void { this.isDeleteModalOpen.set(false); }

  confirmDelete(): void {
    const u = this.userToDelete();
    if (!u) return;
    this.isSaving.set(true);
    this.userService.deleteUser(u.id).subscribe({
      next: () => {
        this.users.update(prev => prev.filter(item => item.id !== u.id));
        this.isSaving.set(false);
        this.closeDeleteModal();
      },
      error: () => { this.isSaving.set(false); this.closeDeleteModal(); }
    });
  }

  downloadPdf(): void {
    this.userService.exportPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Usuarios_${new Date().toISOString().slice(0,10)}.pdf`;
        a.click();
      }
    });
  }

  downloadExcel(): void {
    this.userService.exportExcel().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '_');
        a.download = `Reporte_Usuarios_${dateStr}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el Excel:', err);
        alert('No se pudo procesar la descarga del reporte.');
      }
    });
  }
}