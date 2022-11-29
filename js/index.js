var staffList = [];
document.getElementById('btnThem').onclick = function () {
    document.getElementById('btnCapNhat').style.display = 'none';
    document.getElementById('btnThemNV').style.display = 'block';
    document.getElementById('header-title').innerHTML = 'Thêm Nhân Viên';
    // loại bỏ các span error cũ khi ta click cập nhật 
    removePreviousSpanError();
    // clear các ô input sau khi ta click button Edit  
    resetForm();
    document.getElementById('tknv').disabled = false;
    // Không focus ?
    document.getElementById('tknv').focus();
}
//tạo staff
function createStaff() {
    // nếu validate đúng thì đảo ngược lại là false ko return 
    // còn validate sai thì đảo ngược lại là true chạy if -> return createStaff()
    if (!validateForm()) return;
    // Dom tới giá trị của các ô input
    var staffAccount = document.getElementById('tknv').value;
    var staffFullName = document.getElementById('name').value;
    var staffEmail = document.getElementById('email').value;
    var staffPassword = document.getElementById('password').value;
    var staffWorkDay = document.getElementById('datepicker').value;
    var staffSalary = document.getElementById('luongCB').value;
    var staffPosition = document.getElementById('chucvu').value;
    var staffWorkHours = document.getElementById('gioLam').value;
    // check trùng account
    for (var i = 0; i < staffList.length; i++) {
        if (staffList[i].staffAccount === staffAccount) return alert('Tài khoản đã tồn tại');
    }
    var staff = new Staff(staffAccount, staffFullName, staffEmail, staffPassword, staffWorkDay, staffSalary, staffPosition, staffWorkHours);
    staffList.push(staff);
    // hiển thị "thêm nhân viên thành công"
    document.getElementById('notify').innerHTML = 'Thêm nhân viên thành công';
    document.getElementById('notify').classList.add('NotifyGreen');
    setTimeout(function () {
        document.getElementById('notify').innerHTML = '';
        // nhớ remove để ko bị ảnh hưởng khi ta add class NotifyRed vào
        document.getElementById('notify').classList.remove('NotifyGreen');
    }, 1500);
    renderStaffList();
    saveStaffList();

}
function renderStaffList(data) {
    data = data || staffList;
    var html = '';
    for (var i = 0; i < data.length; i++) {
        html +=
            `
            <tr>
                <td>${data[i].staffAccount}</td>
                <td>${data[i].staffFullName}</td>
                <td>${data[i].staffEmail}</td>
                <td>${data[i].staffWorkDay}</td>
                <td>${data[i].staffPosition}</td>
                <td>${data[i].totalSalary()} VND</td>
                <td>${data[i].rateStaff()}</td>
                <td>
                    <button
                    onclick="getUpdateStaff('${data[i].staffAccount}')"
                    data-toggle="modal" data-target="#myModal"
                    class="btn btn-primary">Edit</button>
                    <button 
                    onclick="modalAreYouSure('${data[i].staffAccount}')" class="btn btn-danger">Del</button>
                </td>
            </tr>
        `
    }
    document.getElementById('tableDanhSach').innerHTML = html;
}
function saveStaffList() {
    localStorage.setItem('SL', JSON.stringify(staffList));
}
function getStaffList() {
    // var staffListJson = localStorage.getItem('SL');
    // if(!staffListJson) return [];
    // else return JSON.parse(staffListJson);
    return localStorage.getItem('SL') ? JSON.parse(localStorage.getItem('SL')) : [];
}
function mapStaffList(local) {
    var result = [];
    for (var i = 0; i < local.length; i++) {
        var newStaff = new Staff(
            local[i].staffAccount,
            local[i].staffFullName,
            local[i].staffEmail,
            local[i].staffPassword,
            local[i].staffWorkDay,
            local[i].staffSalary,
            local[i].staffPosition,
            local[i].staffWorkHours,
        );
        result.push(newStaff);
    }
    return result;
}
// REQUIRE : yêu cầu 
// hàm require là hàm kiểm tra xem ô input có được nhập hay ko ? 
// với value là value được nhập từ ô input, config là 1 object để ta có thể truyền nhiều tham số vào
//    config {validateForm
function require(value, config) {
    var spanErrorList = [
        'Vui lòng nhập tài khoản',
        'Vui lòng nhập họ và tên',
        'Vui lòng nhập Email',
        'Vui lòng nhập mật khẩu',
        'Vui lòng nhập ngày làm',
        'Vui lòng nhập lương cơ bản',
        'Vui lòng chọn chức vụ',
        'Vui lòng nhập giờ làm'
    ];
    var spanError = '';
    switch (config.IdspanNotify) {
        case 'tbTKNV': {
            spanError = spanErrorList[0];
            break;
        }
        case 'tbTen': {
            spanError = spanErrorList[1];
            break;
        }
        case 'tbEmail': {
            spanError = spanErrorList[2];
            break;
        }
        case 'tbMatKhau': {
            spanError = spanErrorList[3];
            break;
        }
        case 'tbNgay': {
            spanError = spanErrorList[4];
            break;
        }
        case 'tbLuongCB': {
            spanError = spanErrorList[5];
            break;
        }
        case 'tbChucVu': {
            spanError = spanErrorList[6];
            break;
        }
        case 'tbGiolam': {
            spanError = spanErrorList[7];
            break;
        }
    }
    if (value.length > 0) {
        document.getElementById(config.IdspanNotify).innerHTML = '';
        document.getElementById(config.IdspanNotify).style.display = 'none';
        return true;
    }
    else {
        document.getElementById(config.IdspanNotify).innerHTML = spanError;
        document.getElementById(config.IdspanNotify).style.display = 'block';
        return false;
    }
}
function regexValid(value, config) {
    var spanErrorList = [
        'Tài khoản phải bao gồm 4-6 kí số và bắt đầu bằng chữ',
        'Họ và tên phải viết hoa chữ cái đầu',
        'Email không đúng định dạng',
        'Mật khẩu từ 6-10 kí tự ( chứa ít nhất 1 kí số, in hoa, kí tự đặc biệt)',
    ];
    var spanError = '';
    switch (config.IdspanNotify) {
        case 'tbTKNV': {
            spanError = spanErrorList[0];
            break;
        }
        case 'tbTen': {
            spanError = spanErrorList[1];
            break;
        }
        case 'tbEmail': {
            spanError = spanErrorList[2];
            break;
        }
        case 'tbMatKhau': {
            spanError = spanErrorList[3];
            break;
        }
    }
    // test regex true/false với ô input 
    if (config.regex.test(value)) {
        document.getElementById(config.IdspanNotify).style.display = 'none';
        return true;
    }
    else {
        document.getElementById(config.IdspanNotify).innerHTML = spanError;
        document.getElementById(config.IdspanNotify).style.display = 'block';
        return false;
    }
}
function ValidRegexDate(dateString) {
    var spanErrorList = [
        'Xin hãy định dạng theo chuẩn mm/dd/yyyy (tháng/ngày/năm)',
        'Nhập số năm không hợp lệ',
        'Nhập tháng không hợp lệ',
        'Nhập ngày không hợp lệ'
    ];
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
        document.getElementById('tbNgay').style.display = 'block';
        document.getElementById('tbNgay').innerHTML = spanErrorList[0];
        return false;
    }
    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000) {
        document.getElementById('tbNgay').style.display = 'block';
        document.getElementById('tbNgay').innerHTML = spanErrorList[1];
        return false;
    }
    if (month == 0 || month > 12) {
        document.getElementById('tbNgay').style.display = 'block';
        document.getElementById('tbNgay').innerHTML = spanErrorList[2];
        return false;
    }

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    if (day > 0 && day <= monthLength[month - 1]) {
        document.getElementById('tbNgay').style.display = 'none';
        return true;
    }
    else {
        document.getElementById('tbNgay').style.display = 'block';
        document.getElementById('tbNgay').innerHTML = spanErrorList[3];
        return false;
    }
};
// thêm dấu phẩy vào ô input nhập tiền lương*
function addCommas() {
    var val = document.getElementById('luongCB').value;
    document.getElementById('luongCB').value = add(val);
    function add(str) {
        return str.replace(/^0+/, '').replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
function validSalary(staffSalary) {
    var salaryWithCommas = staffSalary;
    // đổi tất cả các dấu ',' và đổi thành chuỗi rỗng 
    var salary = salaryWithCommas.replace(/[,]/g, '');
    // nếu số tiền bé hơn 1 củ hoặc 20 củ
    if (salary < 1e+6 || salary > 20e+6) {
        document.getElementById('tbLuongCB').style.display = 'block';
        document.getElementById('tbLuongCB').innerHTML = 'Lương cơ bản tối thiểu 1.000.000đ tối đa 20.000.000đ';
        return false;
    } else {
        document.getElementById('tbLuongCB').style.display = 'none';
        return true;
    }
}
function validWorkHours(validWorkHours) {
    if (validWorkHours < 80 || validWorkHours > 200) {
        document.getElementById('tbGiolam').style.display = 'block';
        document.getElementById('tbGiolam').innerHTML = 'Số giờ làm tối thiểu là 80 giờ, tối đa là 200 giờ';
        return false;
    } else {
        document.getElementById('tbGiolam').style.display = 'none';
        return true;
    }
}
function validateForm() {
    // Dom tới giá trị của các ô input
    var staffAccount = document.getElementById('tknv').value;
    var staffFullName = document.getElementById('name').value;
    var staffEmail = document.getElementById('email').value;
    var staffPassword = document.getElementById('password').value;
    var staffWorkDay = document.getElementById('datepicker').value;
    var staffSalary = document.getElementById('luongCB').value;
    var staffPosition = document.getElementById('chucvu').value;
    var staffWorkHours = document.getElementById('gioLam').value;
    // regex số và chữ -> 4-6 kí tự
    var accountRegex = /^[A-z_](\w|\.|_){3,5}$/;
    var fullNameRegex = /^[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+ [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+(?: [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]*)*/;
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // regex tối thiểu 6 và tối đa 10 ký tự, ít nhất 1 chữ cái viết hoa,1chữ cái viết thường, 1 số và 1 ký tự đặc biệt
    var passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,10}$/;

    var isValidAccount =
        require(staffAccount, { IdspanNotify: 'tbTKNV' }) &&
        regexValid(staffAccount, { IdspanNotify: 'tbTKNV', regex: accountRegex });

    var isValidName =
        require(staffFullName, { IdspanNotify: 'tbTen' }) &&
        regexValid(staffFullName, { IdspanNotify: 'tbTen', regex: fullNameRegex });

    var isValidEmail =
        require(staffEmail, { IdspanNotify: 'tbEmail' }) &&
        regexValid(staffEmail, { IdspanNotify: 'tbEmail', regex: emailRegex });

    var isValidPassword =
        require(staffPassword, { IdspanNotify: 'tbMatKhau' }) &&
        regexValid(staffPassword, { IdspanNotify: 'tbMatKhau', regex: passwordRegex });

    var isValidWorkDate =
        require(staffWorkDay, { IdspanNotify: 'tbNgay' }) &&
        ValidRegexDate(staffWorkDay);

    var isValidSalary =
        require(staffSalary, { IdspanNotify: 'tbLuongCB' }) &&
        validSalary(staffSalary);

    var isValidPosition =
        require(staffPosition, { IdspanNotify: 'tbChucVu' });

    var isValidWorkHours =
        require(staffWorkHours, { IdspanNotify: 'tbGiolam' }) &&
        validWorkHours(staffWorkHours);

    return isValidAccount && isValidName && isValidEmail && isValidPassword && isValidWorkDate && isValidSalary && isValidPosition && isValidWorkHours;
}
function findByAccount(staffAccount) {
    for (var i = 0; i < staffList.length; i++) {
        if (staffList[i].staffAccount === staffAccount) return i;
    }
    return -1;
}
function getUpdateStaff(staffAccount) {
    document.getElementById('btnCapNhat').style.display = 'block';
    document.getElementById('btnThemNV').style.display = 'none';
    document.getElementById('header-title').innerHTML = 'Cập Nhật';
    removePreviousSpanError();
    var index = findByAccount(staffAccount);
    if (index === -1) return alert('Lỗi! Không tồn tại nhân viên này!');
    var staff = staffList[index];
    document.getElementById('tknv').value = staff.staffAccount;
    document.getElementById('name').value = staff.staffFullName;
    document.getElementById('email').value = staff.staffEmail;
    document.getElementById('password').value = staff.staffPassword;
    document.getElementById('datepicker').value = staff.staffWorkDay;
    document.getElementById('luongCB').value = staff.staffSalary;
    document.getElementById('chucvu').value = staff.staffPosition;
    document.getElementById('gioLam').value = staff.staffWorkHours;
    document.getElementById('tknv').disabled = true;

}
// loại bỏ các thông báo span trước đó 
function removePreviousSpanError() {
    document.getElementById('tbTKNV').innerHTML = '';
    document.getElementById('tbTen').innerHTML = '';
    document.getElementById('tbTen').innerHTML = '';
    document.getElementById('tbEmail').innerHTML = '';
    document.getElementById('tbMatKhau').innerHTML = '';
    document.getElementById('tbNgay').innerHTML = '';
    document.getElementById('tbLuongCB').innerHTML = '';
    document.getElementById('tbChucVu').innerHTML = '';
    document.getElementById('tbGiolam').innerHTML = '';
}
function updateStaff() {
    if (!validateForm()) return;
    var staffAccount = document.getElementById('tknv').value;
    var staffFullName = document.getElementById('name').value;
    var staffEmail = document.getElementById('email').value;
    var staffPassword = document.getElementById('password').value;
    var staffDatePicker = document.getElementById('datepicker').value;
    var staffSalary = document.getElementById('luongCB').value;
    var staffPosition = document.getElementById('chucvu').value;
    var staffWorkHours = document.getElementById('gioLam').value;
    var index = findByAccount(staffAccount);
    var staff = staffList[index];
    // kiểm tra nếu chưa cập nhật thì return 
    if (staff.staffFullName === staffFullName && staff.staffEmail === staffEmail && staff.staffPassword === staffPassword && staff.staffWorkDay === staffDatePicker && staff.staffSalary === staffSalary && staff.staffPosition === staffPosition && staff.staffWorkHours === staffWorkHours) {
        document.getElementById('notify').innerHTML = 'Bạn chưa chỉnh sửa thông tin nào cả !';
        document.getElementById('notify').classList.add('NotifyRed');
        setTimeout(function () {
            document.getElementById('notify').innerHTML = '';
            // nhớ remove để ko bị ảnh hưởng khi ta add class NotifyGreen vào
            document.getElementById('notify').classList.remove('NotifyRed');
        }, 1800);
        return;
    }
    // nếu đã cập nhật (chỉnh sửa) rồi thì gán kết quả đã nhập cho thằng NV. 
    staff.staffAccount = staffAccount;
    staff.staffFullName = staffFullName;
    staff.staffEmail = staffEmail;
    staff.staffPassword = staffPassword;
    staff.staffWorkDay = staffDatePicker;
    staff.staffSalary = staffSalary;
    staff.staffPosition = staffPosition;
    staff.staffWorkHours = staffWorkHours;
    // hiển thị "cập nhật nhân viên thành công"
    document.getElementById('notify').innerHTML = 'Cập nhật nhân viên thành công';
    document.getElementById('notify').classList.add('NotifyGreen');
    setTimeout(function () {
        document.getElementById('notify').innerHTML = '';
        // nhớ remove để ko bị ảnh hưởng khi ta add class red vào
        document.getElementById('notify').classList.remove('NotifyGreen');
    }, 1800);
    renderStaffList();
    saveStaffList();
}
function resetForm() {
    document.getElementById('Myform').reset();
}
function searchStaff(e) {
    var keyword = e.target.value.trim().toLowerCase();
    var result = [];
    for (var i = 0; i < staffList.length; i++) {
        var staffRate = staffList[i].rateStaff().toLowerCase();
        if (staffRate.includes(keyword)) {
            result.push(staffList[i]);
        }
    }
    renderStaffList(result);
}
function deleteStaff(staffAccount) {
    var index = findByAccount(staffAccount);
    if (index === -1) return alert('Lỗi! Không tồn tại nhân viên này!');
    staffList.splice(index, 1);
    renderStaffList();
    saveStaffList();
}
window.onload = function () {
    staffList = mapStaffList(getStaffList());
    renderStaffList();
}