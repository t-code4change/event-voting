const fs = require('fs');
const path = require('path');

// Đọc file blog-posts.json
const filePath = path.join(__dirname, '../data/blog-posts.json');
const blogPosts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`Đang xử lý ${blogPosts.length} bài viết...`);

// Fix từng bài viết
blogPosts.forEach((post, index) => {
  if (post.content) {
    // Xóa tất cả \n trong content
    let fixedContent = post.content.replace(/\n/g, '');

    post.content = fixedContent;
    console.log(`✅ Đã fix bài viết #${index + 1}: ${post.title}`);
  }
});

// Lưu lại file với format đẹp
fs.writeFileSync(filePath, JSON.stringify(blogPosts, null, 2), 'utf8');

console.log('\n✅ Hoàn thành! Đã fix tất cả line breaks thừa trong content.');
