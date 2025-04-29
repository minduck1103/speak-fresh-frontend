# Hướng dẫn deploy frontend lên Vercel

## 1. Tạo file .env.production

Tạo file `frontend/.env.production` với nội dung:
```
VITE_API_URL=https://speak-fresh-backend.onrender.com
# Nếu có dùng Stripe, thêm dòng sau:
# VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 2. Đẩy code lên GitHub

```bash
git add .
git commit -m "Chuẩn bị deploy frontend lên Vercel"
git push
```

## 3. Deploy lên Vercel
- Truy cập https://vercel.com
- Chọn "Add New Project" > Import repository frontend từ GitHub
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Thêm biến môi trường:
  - Key: `VITE_API_URL`
  - Value: `https://speak-fresh-backend.onrender.com`
- Nhấn Deploy

## 4. Kiểm tra
- Truy cập URL Vercel cung cấp
- Kiểm tra các chức năng frontend
- Nếu cần cập nhật backend, hãy cập nhật biến FRONTEND_URL trên Render 