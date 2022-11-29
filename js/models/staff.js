function Staff(staffAccount, staffFullName, staffEmail, staffPassword, staffWorkDay, staffSalary, staffPosition, staffWorkHours) {
    this.staffAccount = staffAccount;
    this.staffFullName = staffFullName;
    this.staffEmail = staffEmail;
    this.staffPassword = staffPassword;
    this.staffWorkDay = staffWorkDay;
    this.staffSalary = staffSalary;
    this.staffPosition = staffPosition;
    this.staffWorkHours = staffWorkHours;
    this.totalSalary = function () {
        // bỏ dấu phẩy ra khỏi tiền [nhớ chuyển chuỗi số thành chuỗi kí tự toString() do lúc DOM nó vẫn là string nên ko cần làm bước toString()]
        var salary = this.staffSalary.replace(/[,]/g, '');
        if (this.staffPosition === 'Sếp') salary * 3;
        else if (this.staffPosition === 'Trưởng phòng') salary * 2;
        // thêm dấu phẩy vào số tiền -> chuyển chuỗi số thành string  .toString()
        // console.log(salary.toString().replace(/^0+/, '').replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","))
        return salary.toString().replace(/^0+/, '').replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    this.rateStaff = function () {
        var rate = [
            'Xuất sắc',
            'Giỏi',
            'Khá',
            'Trung bình'
        ];
        if (this.staffWorkHours >= 192) return rate[0];
        else if (this.staffWorkHours >= 176) return rate[1];
        else if (this.staffWorkHours >= 160) return rate[2];
        else return rate[3];
    }
}