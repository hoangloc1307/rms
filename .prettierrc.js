module.exports = {
  experimentalTernaries: true, // Cải thiện format toán tử ba ngôi (?:)
  experimentalOperatorPosition: 'start', // Đưa toán tử xuống đầu dòng khi xuống hàng
  printWidth: 80, // Giới hạn số ký tự tối đa mỗi dòng
  tabWidth: 2, // Số khoảng trắng cho mỗi mức thụt đầu dòng
  useTabs: false, // false = dùng space, true = dùng tab
  semi: true, // Thêm dấu chấm phẩy ở cuối câu lệnh
  singleQuote: true, // true = dùng '', false = dùng ""
  quoteProps: 'as-needed', // Chỉ thêm ngoặc kép quanh key object khi cần
  trailingComma: 'es5', // Thêm dấu phẩy cuối trong object/array (ES5+)
  bracketSpacing: true, // Thêm khoảng trắng giữa { và nội dung bên trong }
  objectWrap: 'collapse', // Gộp object thành 1 dòng nếu đủ ngắn
  arrowParens: 'always', // Luôn thêm ngoặc () quanh tham số arrow function
};
