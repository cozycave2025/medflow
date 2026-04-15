// app/dashboard/lib/utils.ts
export function getExpiryStatus(expiryDate: string, marginDays: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'Expired', color: 'rose', days: diffDays };
    if (diffDays <= marginDays) return { status: 'Expiring Soon', color: 'orange', days: diffDays };
    return { status: 'Safe', color: 'emerald', days: diffDays };
}
