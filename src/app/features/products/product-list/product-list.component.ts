import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  public auth = inject(AuthService);

  // Signals de estado
  public products = signal<any[]>([]);
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string>('');
  public isModalOpen = signal<boolean>(false);
  public isEditing = signal<boolean>(false);
  public isSaving = signal<boolean>(false);
  public isDeleteModalOpen = signal<boolean>(false);
  public productToDelete = signal<any>(null);

  // Formulario y control de ID
  public productForm!: FormGroup;
  private currentProductId: string | null = null;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      code: [{ value: '', disabled: true }],
      name: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01), Validators.max(999.99)]] 
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any[]) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('No se pudieron cargar los productos.');
        this.isLoading.set(false);
      }
    });
  }

 
  openCreateModal(): void {
    this.isEditing.set(false);
    this.currentProductId = null;
    this.productForm.reset({ price: 0 });
    this.productForm.get('code')?.disable(); 
    this.isModalOpen.set(true);
  }

  openDeleteModal(product: any): void {
    this.productToDelete.set(product);
    this.isDeleteModalOpen.set(true);
  }

  openEditModal(product: any): void {
    this.isEditing.set(true);
    this.currentProductId = product.id;
    this.productForm.get('code')?.enable();
    this.productForm.patchValue({
      code: product.code,
      name: product.name,
      brand: product.brand || '',
      price: product.price
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.productToDelete.set(null);
  }

  onSave(): void {
    if (this.productForm.invalid) return;
    this.isSaving.set(true);
    const productData = this.productForm.getRawValue();

    if (this.isEditing() && this.currentProductId) {
      this.productService.updateProduct(this.currentProductId, productData).subscribe({
        next: () => {
          this.products.update(prev => 
            prev.map(p => p.id === this.currentProductId ? { ...p, ...productData } : p)
          );
          this.isSaving.set(false);
          this.closeModal();
        },
        error: () => {
          alert('Error al actualizar el producto.');
          this.isSaving.set(false);
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.isSaving.set(false);
          this.closeModal();
        },
        error: () => {
          alert('Error al crear el producto.');
          this.isSaving.set(false);
        }
      });
    }
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (!product) return;

    this.isSaving.set(true);
    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products.update(prev => prev.filter(p => p.id !== product.id));
        this.isSaving.set(false);
        this.closeDeleteModal();
      },
      error: () => {
        alert('Error al intentar eliminar el producto de la base de datos.');
        this.isSaving.set(false);
        this.closeDeleteModal();
      }
    });
  }

  downloadPdf(): void {
    this.productService.exportToPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Productos_${new Date().toISOString().slice(0,10)}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Error al generar el reporte en PDF.')
    });
  }

  downloadExcel(): void {
    this.productService.exportToExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Productos_${new Date().toISOString().slice(0,10)}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Error al generar el reporte en Excel.')
    });
  }
}