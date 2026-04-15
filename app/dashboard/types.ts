// app/dashboard/types.ts

export interface Medicine {
    _id: string;
    name: string;
    batch: string;
    expiry: string;
    stock: number;
    purchasePrice: string;
    sellPrice: string;
    barcode: string;
    price: string;
    createdAt: string;
    updatedAt: string;
}

export interface Supplier {
    _id: string;
    name: string;
    phone: string;
    purchases: string;
    createdAt: string;
    updatedAt: string;
}

export interface Customer {
    _id: string;
    name: string;
    phone: string;
    purchases: string;
    createdAt: string;
    updatedAt: string;
}

export interface Expense {
    _id: string;
    title: string;
    amount: string;
    date: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SaleItem {
    medicineId: string;
    name: string;
    quantity: number;
    price: string;
}

export interface Sale {
    _id: string;
    customerName: string;
    customerId?: string;
    items: SaleItem[];
    totalAmount: string;
    profit: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface Setting {
    _id: string;
    key: string;
    value: string;
    createdAt: string;
    updatedAt: string;
}

export interface Notification {
    _id: string;
    type: 'expiry' | 'stock' | 'system';
    message: string;
    status: 'unread' | 'read';
    relatedId?: string;
    createdAt: string;
    updatedAt: string;
}
