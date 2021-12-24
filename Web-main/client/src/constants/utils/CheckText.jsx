// Kiểm tra xem có phải Tiếng Việt hợp lệ hay không
export function isVietnamese(str) {
  var re = /^[a-zA-Z!@#$%^&*)( +=._-]{2,}$/g; // regex here
  return re.test(removeVietnameseTones(str));
}

// Loại bỏ các từ tiếng Việt -> thay bằng ký tự tiếng Anh
export function removeVietnameseTones(str) {
  if (str === null || str === undefined) return str;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  return str;
}

export function isNumber(str) {
  var reg = /^\d+$/;
  return reg.test(str);
}

export function isNotDuplicatedName(listLocal, newName) {
  console.log(listLocal);
  return listLocal.every((local) => {
    return local.name !== newName;
  });
}

export function isNotDuplicatedCode(listLocal, newCode) {
  console.log('running code');
  return listLocal.every((local) => {
    return local.id !== newCode;
  });
}
