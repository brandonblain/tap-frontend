import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {
  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);
  public auth = inject(AuthService);

  public profiles = signal<any[]>([]);
  public isLoading = signal<boolean>(true);
  public isSaving = signal<boolean>(false);
  public isModalOpen = signal<boolean>(false);
  public isEditing = signal<boolean>(false);
  public isDeleteModalOpen = signal<boolean>(false);
  
  public currentProfileId: string | null = null;
  public profileToDelete = signal<any>(null);
  public profileForm!: FormGroup;

  public availableSections = [
    { value: 'products.view', label: 'Ver Catálogo de Productos' },
    { value: 'products.create', label: 'Crear Productos' },
    { value: 'products.edit', label: 'Editar Productos' },
    { value: 'products.delete', label: 'Eliminar Productos' },
    { value: 'users.view', label: 'Ver Consulta de Usuarios' },
    { value: 'users.create', label: 'Registrar Usuarios' },
    { value: 'users.edit', label: 'Editar Usuarios' },
    { value: 'users.delete', label: 'Eliminar Usuarios' },
    { value: 'profiles.view', label: 'Ver Lista de Perfiles' },
    { value: 'profiles.create', label: 'Crear Perfiles' },
    { value: 'profiles.edit', label: 'Editar Perfiles' },
    { value: 'profiles.delete', label: 'Eliminar Perfiles' }
  ];

  selectedSections: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.loadProfiles();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      code: [{ value: '', disabled: true }],
      name: ['', [Validators.required]]
    });
  }

  loadProfiles(): void {
    this.profileService.getProfiles().subscribe({
      next: (data) => { this.profiles.set(data); this.isLoading.set(false); },
      error: () => { this.isLoading.set(false); }
    });
  }

  // Maneja la selección/deselección de los checkboxes en tiempo real
  onCheckboxChange(event: any, sectionValue: string): void {
    if (event.target.checked) {
      if (!this.selectedSections.includes(sectionValue)) {
        this.selectedSections.push(sectionValue);
      }
    } else {
      this.selectedSections = this.selectedSections.filter(s => s !== sectionValue);
    }
  }

  isSectionChecked(sectionValue: string): boolean {
    return this.selectedSections.includes(sectionValue);
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.currentProfileId = null;
    this.selectedSections = [];
    this.profileForm.reset();
    this.isModalOpen.set(true);
  }

  openEditModal(profile: any): void {
    this.isEditing.set(true);
    this.currentProfileId = profile.id;
    this.selectedSections = [...profile.sections];
    this.profileForm.patchValue({
      code: profile.code,
      name: profile.name
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void { this.isModalOpen.set(false); }

  onSave(): void {
    if (this.profileForm.invalid) return;
    this.isSaving.set(true);

    const dataToSend = {
      name: this.profileForm.getRawValue().name,
      sections: this.selectedSections
    };

    if (this.isEditing() && this.currentProfileId) {
      this.profileService.updateProfile(this.currentProfileId, dataToSend).subscribe({
        next: () => { this.loadProfiles(); this.isSaving.set(false); this.closeModal(); },
        error: () => this.isSaving.set(false)
      });
    } else {
      this.profileService.createProfile(dataToSend).subscribe({
        next: () => { this.loadProfiles(); this.isSaving.set(false); this.closeModal(); },
        error: () => this.isSaving.set(false)
      });
    }
  }

  openDeleteModal(profile: any): void {
    this.profileToDelete.set(profile);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void { this.isDeleteModalOpen.set(false); }

  confirmDelete(): void {
    const p = this.profileToDelete();
    if (!p) return;
    this.isSaving.set(true);
    this.profileService.deleteProfile(p.id).subscribe({
      next: () => {
        this.profiles.update(prev => prev.filter(item => item.id !== p.id));
        this.isSaving.set(false);
        this.closeDeleteModal();
      },
      error: () => { this.isSaving.set(false); this.closeDeleteModal(); }
    });
  }

  downloadPdf(): void {
    this.profileService.exportPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Perfiles_${new Date().toISOString().slice(0,10)}.pdf`;
        a.click();
      }
    });
  }

  downloadExcel(): void {
    this.profileService.exportExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Perfiles_${new Date().toISOString().slice(0,10)}.xlsx`;
        a.click();
      }
    });
  }
}