import { CarrierCode, Category, Product, Supplier } from './models'

export interface ProductStore {
  products: Product[]
  selectedProduct: Product | null

  setProducts: (products: Product[]) => void
  setSelectedProduct: (product: Product) => void

  getProducts: () => Promise<void>
  getProduct: (id: number) => Promise<void>
  createProduct: (product: Product) => Promise<void>
  updateProduct: (id: number, product: Product) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
}

export interface CategoryStore {
  categories: Category[]
  selectedCategory: Category | null

  setCategory: (category: Category[]) => void
  setSelectedCategory: (category: Category) => void

  getCategories: () => Promise<void>
  getCategory: (id: number) => Promise<void>
  // createCategory: (category: Category) => Promise<void>
  // updateCategory: (id: number, category: Category) => Promise<void>
  // deleteCategory: (id: number) => Promise<void>
}

export interface SupplierStore {
  suppliers: Supplier[]
  selectedSupplier: Supplier | null

  setSupplier: (supplier: Supplier[]) => void
  setSelectedSupplier: (supplier: Supplier) => void

  getSuppliers: () => Promise<void>
  getSupplier: (id: number) => Promise<void>
  createSupplier: (supplier: Supplier) => Promise<void>
  updateSupplier: (id: number, supplier: Supplier) => Promise<void>
  deleteSupplier: (id: number) => Promise<void>
}

export interface CarrierCodeStore {
  ccs: CarrierCode[]
  selectedCc: CarrierCode | null

  setCcs: (cc: CarrierCode[]) => void
  setSelectedCc: (cc: CarrierCode) => void

  getCcs: () => Promise<void>
  getCc: (id: number) => Promise<void>
  // createCategory: (category: Category) => Promise<void>
  // updateCategory: (id: number, category: Category) => Promise<void>
  // deleteCategory: (id: number) => Promise<void>
}
