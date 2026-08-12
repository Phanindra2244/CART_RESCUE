# Task: Sync completed customer orders into Admin Active Sessions Stream

## Steps
- [x] 1. Add `placedOrders` state + `recordPlacedOrder()` to `context/store-context.tsx`
- [x] 2. Call `recordPlacedOrder()` in `app/store/payment/page.tsx` handleSimulateSuccess
- [x] 3. Merge `placedOrders` into Active Sessions Stream in `app/dashboard/page.tsx`
- [ ] 4. Verify in Chrome

