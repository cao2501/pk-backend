# Hướng dẫn Upload Ảnh Sản Phẩm

## Tính năng Upload Ảnh

Website đã được nâng cấp để hỗ trợ upload ảnh sản phẩm trực tiếp thay vì chỉ sử dụng link ảnh.

### Backend Features

#### 1. Multer Configuration
- **File types**: JPEG, PNG, WebP
- **Max file size**: 5MB per image
- **Max files**: 5 images per product
- **Storage**: Local storage in `uploads/` folder

#### 2. API Endpoints
- `POST /api/products` - Tạo sản phẩm với ảnh upload
- `PUT /api/products/:id` - Cập nhật sản phẩm với ảnh upload
- `GET /uploads/:filename` - Serve static files

#### 3. File Structure
```
backend/
├── uploads/           # Thư mục lưu ảnh upload
├── src/
│   ├── middleware/
│   │   └── upload.js  # Cấu hình multer
│   └── controllers/
│       └── product.controller.js  # Xử lý upload
```

### Frontend Features

#### 1. Admin Panel
- **File input**: Chọn nhiều ảnh cùng lúc
- **Preview**: Xem trước ảnh trước khi upload
- **Remove preview**: Xóa ảnh khỏi preview
- **Fallback**: Vẫn hỗ trợ nhập URL ảnh

#### 2. Product Display
- **ProductCard**: Hiển thị ảnh upload với hover effects
- **ProductDetail**: Gallery ảnh với thumbnail navigation
- **Multiple images**: Hiển thị số lượng ảnh còn lại

#### 3. Image URL Handling
```javascript
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://via.placeholder.com/400x300'
  if (imageUrl.startsWith('http')) return imageUrl
  return `${import.meta.env.VITE_API_URL}${imageUrl}`
}
```

### Cách sử dụng

#### 1. Thêm sản phẩm mới
1. Vào trang Admin → Quản lý sản phẩm
2. Chọn ảnh từ máy tính (tối đa 5 ảnh)
3. Xem preview ảnh
4. Điền thông tin sản phẩm
5. Nhấn "Thêm sản phẩm"

#### 2. Cập nhật sản phẩm
1. Nhấn "Sửa" trên sản phẩm cần cập nhật
2. Chọn ảnh mới (sẽ thay thế ảnh cũ)
3. Cập nhật thông tin khác
4. Nhấn "Cập nhật sản phẩm"

#### 3. Xem sản phẩm
- **Trang chủ**: Hiển thị ảnh đầu tiên
- **Danh mục**: Grid layout với hover effects
- **Chi tiết**: Gallery đầy đủ với navigation

### Validation & Error Handling

#### Backend Validation
- File type: Chỉ cho phép JPEG, PNG, WebP
- File size: Tối đa 5MB mỗi ảnh
- File count: Tối đa 5 ảnh mỗi sản phẩm

#### Frontend Validation
- File input: `accept="image/*"`
- Preview: Hiển thị lỗi nếu file không hợp lệ
- Upload state: Loading indicator khi đang upload

### Security Features

#### 1. File Type Validation
```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)
  
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh (JPEG, PNG, WebP)'))
  }
}
```

#### 2. File Size Limit
```javascript
limits: {
  fileSize: 5 * 1024 * 1024, // 5MB
}
```

#### 3. Unique Filename
```javascript
filename: function (req, file, cb) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
}
```

### Deployment Notes

#### 1. Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
```

#### 2. Static File Serving
```javascript
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
```

#### 3. Production Considerations
- **Cloud Storage**: Có thể tích hợp Cloudinary, AWS S3
- **CDN**: Sử dụng CDN để tối ưu tốc độ load ảnh
- **Backup**: Backup thư mục uploads định kỳ

### Troubleshooting

#### 1. Ảnh không hiển thị
- Kiểm tra URL ảnh có đúng format không
- Kiểm tra server có serve static files không
- Kiểm tra CORS settings

#### 2. Upload thất bại
- Kiểm tra file size (tối đa 5MB)
- Kiểm tra file type (JPEG, PNG, WebP)
- Kiểm tra quyền ghi thư mục uploads

#### 3. Performance Issues
- Optimize ảnh trước khi upload
- Sử dụng lazy loading cho ảnh
- Implement image compression

### Future Enhancements

1. **Image Compression**: Tự động nén ảnh trước khi lưu
2. **Multiple Sizes**: Tạo thumbnail, medium, large sizes
3. **Cloud Storage**: Tích hợp Cloudinary/AWS S3
4. **Image Editor**: Crop, resize ảnh trực tiếp trên web
5. **Bulk Upload**: Upload nhiều ảnh cùng lúc
6. **Image Optimization**: WebP conversion, lazy loading
