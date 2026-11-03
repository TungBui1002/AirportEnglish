# Airport English – PBB Learning

> **Tagline:** Learn English. Understand Aviation. Operate Safely.

**Airport English – PBB Learning** là ứng dụng web học tiếng Anh chuyên ngành hàng không hiện đại, tập trung chuyên sâu vào công việc vận hành, kỹ thuật và an toàn cầu hành khách (Passenger Boarding Bridge - PBB).

Dự án mang đến trải nghiệm học tập trực quan, kết hợp ưu điểm của **Quizlet** (ghi nhớ flashcard đa chiều, lật thẻ 3D) và **Duolingo** (học qua thực hành, trắc nghiệm phản xạ, bài tập xếp câu tương tác, tích điểm và theo dõi tiến độ).

---

## 📑 Mục lục
1. [Đối tượng sử dụng](#-đối-tượng-sử-dụng)
2. [Tính năng và Các Module chức năng](#-tính-năng-và-các-module-chức-năng)
3. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
4. [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
5. [Hướng dẫn cài đặt & Chạy ứng dụng](#-hướng-dẫn-cài-đặt--chạy-ứng-dụng)
6. [Hướng dẫn Triển khai (Deploy)](#-hướng-dẫn-triển-khai-deploy)
7. [Hướng dẫn Đóng góp Từ vựng & Mẫu câu mới](#-hướng-dẫn-đóng-góp-từ-vựng--mẫu-câu-mới)
8. [Tuyên bố miễn trừ trách nhiệm](#-tuyên-bố-miễn-trừ-trách-nhiệm)

---

## 🎯 Đối tượng sử dụng
- **Nhân viên vận hành cầu hành khách (PBB Operators):** Nắm vững các thuật ngữ màn hình GOP, cần điều khiển DC, hệ thống cân bằng tự động A/L.
- **Kỹ thuật viên & Kỹ sư bảo trì sân bay:** Hiểu rõ các thông số điện tử, biến tần VFD, cảm biến an toàn, cáp GPU 400Hz, khí PCA.
- **Nhân viên mặt đất và nhân sự mới:** Làm quen nhanh với các ký hiệu viết tắt quốc tế (ATC, FOD, VGDS, BHS, SMS, SOP).
- **Học viên & Người đam mê hàng không:** Nâng cao vốn từ vựng và khẩu lệnh giao tiếp hàng không thực tế.

---

## 🚀 Tính năng và Các Module chức năng

### 📊 Module A – Dashboard (Tổng quan)
- Hiển thị thông số tổng thể: Tổng từ vựng (57 từ), Số từ đã học, Số từ đã thành thạo, Số bài Quiz đã hoàn thành, Điểm trung bình và Tỷ lệ chính xác.
- Thanh tiến độ ghi nhớ (Progress bar) trực quan với phân loại mức độ học.
- Nhật ký hoạt động gần đây (Recent Activities) được cập nhật theo thời gian thực.
- Lối tắt truy cập nhanh: "Tiếp tục học ngay", "Làm bài Quiz nhanh", "Thực hành mẫu câu".

### 📖 Module B – Vocabulary (Kho từ vựng & Thuật ngữ)
- Danh mục 57 thuật ngữ chuẩn hóa về PBB, hệ thống điện tử, điều khiển, an toàn và khai thác mặt đất.
- Tìm kiếm tức thì theo chữ viết tắt, tên tiếng Anh hoặc nghĩa tiếng Việt.
- Bộ lọc theo nhóm chuyên ngành: *PBB, Electrical, Control Systems, Airport Operations, Safety, General Aviation, Standards & Organizations*.
- Bộ lọc theo trạng thái học: *Tất cả, Đã yêu thích (Favorite), Đã học, Chưa học*.
- Sắp xếp linh hoạt theo A-Z (Ký hiệu hoặc Tên đầy đủ).
- Xem chi tiết từ vựng trong hộp thoại Modal với giải thích câu khẩu lệnh mẫu và ghi chú chuyên ngành.

### 🗂️ Module C – Flashcard (Thẻ ghi nhớ 3D)
- Hiệu ứng lật thẻ 3D xoay 180 độ mượt mà.
- Mặt trước: Ký hiệu viết tắt & Nhóm chuyên ngành.
- Mặt sau: Tên tiếng Anh đầy đủ (Full Name), Nghĩa tiếng Việt, Câu ví dụ tác nghiệp thực tế.
- Các nút điều khiển: *Thẻ trước (Previous), Thẻ sau (Next), Xáo trộn ngẫu nhiên (Shuffle), Đã thuộc (I Know This), Cần luyện thêm (Need More Practice)*.
- Hỗ trợ phím tắt: Phím `Khoảng trắng` hoặc `Enter` để lật thẻ, phím `Mũi tên Trái / Phải` để chuyển thẻ.

### 🎯 Module D – Quiz (Trắc nghiệm Chuyên sâu)
- **5 chế độ luyện tập:**
  1. *English → Tiếng Việt*
  2. *Tiếng Việt → English*
  3. *Từ viết tắt → Tên tiếng Anh đầy đủ*
  4. *Tên tiếng Anh đầy đủ → Từ viết tắt*
  5. *Tổng hợp ngẫu nhiên (Random Quiz)*
- Mỗi câu gồm 4 đáp án xáo trộn, chỉ có 1 đáp án chính xác.
- Phản hồi đúng/sai tức thì kèm màu sắc và giải thích chi tiết đáp án.
- Tùy chọn số lượng câu hỏi linh hoạt: **10 câu**, **20 câu**, hoặc **30 câu**.
- Màn hình tổng kết điểm, tỷ lệ phần trăm và **bảng tổng hợp các câu trả lời sai kèm đáp án đúng để ôn lại**.
- Lưu lịch sử kết quả vào LocalStorage.

### ✈️ Module E – Sentence Practice (Mẫu câu Tác nghiệp)
- 24 mẫu câu thực tế chia theo 8 chủ đề trọng tâm:
  1. *Passenger Boarding Bridge Operations*
  2. *Aircraft Parking and Docking*
  3. *Safety Instructions*
  4. *Emergency Situations*
  5. *Equipment Inspection*
  6. *Technical Maintenance*
  7. *Communication at Airport*
  8. *Electrical and Control Systems*
- Mỗi mẫu câu bao gồm: Câu tiếng Anh chuẩn, Dịch nghĩa tiếng Việt, Từ vựng then chốt (Key Vocabulary), Tình huống áp dụng cụ thể và Mức độ khó (Basic, Intermediate, Advanced).
- Tích hợp tính năng phát âm tiếng Anh (Text-to-Speech) qua Web Speech API.

### 🧩 Module F – Sentence Quiz (Thực hành Ghép câu)
- Đa dạng hình thức bài tập:
  - **Ghép/xếp từ thành câu (Sentence Unscramble):** Chạm vào các thẻ từ trong kho từ để xếp vào ô câu hoàn chỉnh.
  - **Điền từ vào chỗ trống (Fill in the blanks).**
  - **Dịch câu tiếng Anh sang tiếng Việt & ngược lại.**
- Giao diện thân thiện, không đòi hỏi nhập gõ phức tạp trên điện thoại.

### 📈 Module G – Progress (Tiến độ & Thống kê)
- Báo cáo số liệu học tập tích lũy.
- Bảng lịch sử các bài Quiz đã làm theo thời gian.
- Nút **Reset Learning Progress** với hộp thoại xác nhận an toàn để bắt đầu lại từ đầu khi cần.

---

## 🛠️ Công nghệ sử dụng
- **HTML5 & CSS3** hiện đại (CSS Variables, Flexbox, CSS Grid, 3D CSS Transforms, Media Queries).
- **Vanilla JavaScript ES6+** dạng module hóa, không phụ thuộc vào React, Vue hay Angular.
- **Vite** làm công cụ phát triển (Dev server cực nhanh và Build tối ưu hóa kích thước).
- **LocalStorage API** lưu trữ bền vững trạng thái học, danh sách yêu thích và lịch sử trắc nghiệm trên trình duyệt người dùng.
- **Web Speech API** hỗ trợ phát âm chuẩn từ vựng và câu khẩu lệnh.

---

## 📂 Cấu trúc thư mục

```
AirportEnglish/
├── index.html                   # HTML gốc của ứng dụng
├── package.json                 # Cấu hình dự án & Scripts
├── vite.config.js               # Cấu hình Vite (hỗ trợ relative path cho deploy)
├── .gitignore                   # Loại trừ file build và dependencies
├── README.md                    # Tài liệu hướng dẫn chi tiết
└── src/
    ├── data/
    │   ├── vocabulary.json      # Cơ sở dữ liệu 57 thuật ngữ hàng không PBB
    │   └── sentences.json       # Cơ sở dữ liệu 24 mẫu câu tác nghiệp 8 chủ đề
    ├── pages/
    │   ├── Dashboard.js         # Module A - Trang tổng quan
    │   ├── Vocabulary.js        # Module B - Danh mục từ vựng
    │   ├── Flashcard.js         # Module C - Thẻ lật ghi nhớ 3D
    │   ├── Quiz.js              # Module D - Trắc nghiệm 5 chế độ
    │   ├── SentencePractice.js  # Module E - Mẫu câu giao tiếp
    │   ├── SentenceQuiz.js      # Module F - Ghép câu tương tác
    │   └── Progress.js          # Module G - Báo cáo tiến độ & Lịch sử
    ├── services/
    │   ├── storageService.js    # Quản lý LocalStorage & Thống kê
    │   └── quizService.js       # Sinh câu hỏi trắc nghiệm & Tính điểm
    ├── styles/
    │   └── main.css             # Hệ thống Style hoàn chỉnh (Design System)
    ├── utils/
    │   └── helpers.js           # Các hàm tiện ích (shuffle, toast, modal, format)
    └── main.js                  # Điểm khởi chạy chính & Client Router
```

---

## 💻 Hướng dẫn cài đặt & Chạy ứng dụng

### Yêu cầu tiên quyết
- Cài đặt **Node.js** (khuyến nghị phiên bản 18 trở lên).

### Bước 1: Cài đặt thư viện phụ thuộc
Mở terminal trong thư mục dự án và chạy:
```bash
npm install
```

### Bước 2: Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Trình duyệt sẽ tự động mở hoặc truy cập địa chỉ: `http://localhost:3000`

### Bước 3: Đóng gói bản Production (Build)
```bash
npm run build
```
Kết quả bản tĩnh sẽ nằm trong thư mục `dist/`, sẵn sàng đưa lên bất kỳ Web Server hoặc dịch vụ hosting nào.

Bạn có thể xem trước bản build bằng:
```bash
npm run preview
```

---

## 🌐 Hướng dẫn Triển khai (Deploy)

### 1. Triển khai lên GitHub Pages
Dự án đã được cấu hình đường dẫn tương đối (`base: './'` trong `vite.config.js`), tương thích hoàn toàn với GitHub Pages.

**Cách 1: Sử dụng thư viện `gh-pages`**
```bash
npm install --save-dev gh-pages
```
Thêm script vào `package.json`:
```json
"scripts": {
  "deploy": "vite build && gh-pages -d dist"
}
```
Chạy lệnh:
```bash
npm run deploy
```

**Cách 2: Sử dụng GitHub Actions**
1. Đẩy code lên repository GitHub.
2. Vào tab **Settings** > **Pages** trên GitHub repository.
3. Trong mục **Build and deployment**, chọn Source là **GitHub Actions**.
4. Chọn workflow template **Static HTML / Vite** để tự động build và deploy mỗi khi có commit mới.

### 2. Triển khai lên Cloudflare Pages
1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Pages**.
2. Chọn **Connect to Git** và chọn repository `AirportEnglish`.
3. Cài đặt thông số build:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Bấm **Save and Deploy**. Website sẽ online sau 30 giây!

### 3. Triển khai lên Vercel hoặc Netlify
Chỉ cần kéo thả thư mục `dist/` vào giao diện Netlify Drop, hoặc liên kết GitHub repo với Vercel / Netlify với câu lệnh build là `npm run build` và thư mục xuất bản là `dist`.

---

## 🤝 Hướng dẫn Đóng góp Từ vựng & Mẫu câu mới

Dự án được thiết kế tách biệt hoàn toàn giữa dữ liệu (`src/data/`) và logic hiển thị/trắc nghiệm. Bạn có thể mở rộng từ vựng hoặc mẫu câu mà **không cần chỉnh sửa bất kỳ dòng mã JavaScript nào**.

### Thêm từ vựng mới vào `src/data/vocabulary.json`:
```json
{
  "id": 58,
  "abbreviation": "VDGS",
  "fullName": "Visual Docking Guidance System",
  "meaning": "Hệ thống hướng dẫn cập đỗ tàu bay bằng mắt",
  "category": "PBB",
  "exampleSentence": "The operator monitored the VDGS display to ensure precise aircraft stop alignment.",
  "exampleTranslation": "Nhân viên vận hành theo dõi màn hình VDGS để đảm bảo máy bay dừng đúng vị trí vạch chuẩn."
}
```

### Thêm mẫu câu tác nghiệp mới vào `src/data/sentences.json`:
```json
{
  "id": 25,
  "topicId": 1,
  "topic": "Passenger Boarding Bridge Operations",
  "english": "Retract the bridge canopy fully before lowering the floor leveling shoe.",
  "vietnamese": "Thu hồi hoàn toàn mui bạt trước khi hạ chân cảm biến cao độ sàn cầu.",
  "importantVocabulary": [
    { "word": "Retract", "meaning": "Thu hồi, co lại" },
    { "word": "Canopy", "meaning": "Mui bạt che" },
    { "word": "Leveling shoe", "meaning": "Chân cảm biến cân bằng" }
  ],
  "situation": "Khi bắt đầu quy trình tách cầu khỏi thân máy bay trước lúc cất cánh.",
  "difficulty": "Intermediate"
}
```

Sau khi thêm, hệ thống sẽ tự động cập nhật thống kê, bộ lọc nhóm, danh mục Flashcard và các câu hỏi trong bài Quiz trắc nghiệm.

---

## ⚠️ Tuyên bố miễn trừ trách nhiệm
Ứng dụng **Airport English – PBB Learning** được xây dựng nhằm mục đích học tập, rèn luyện ngoại ngữ và nâng cao phản xạ tiếng Anh chuyên ngành. Các mẫu câu, thuật ngữ và tình huống an toàn trong ứng dụng không thay thế cho tài liệu **SOP chính thức**, sổ tay vận hành của nhà sản xuất PBB (OEM Manuals) hay các quy chế an toàn bay do Cục Hàng không và Cảng Hàng không ban hành.

