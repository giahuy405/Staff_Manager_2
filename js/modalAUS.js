var frame = document.getElementById('Myframe');
var clickClose = document.getElementById('close');
var overlay = document.getElementById('overlay');
var modalAUS=document.getElementById('modalAUS');

function modalAreYouSure(a) {
    overlay.classList.add('state-show');
    frame.classList.add('state-appear');
    // lưu tham số account của thằng nhân viên vào localStorage
    localStorage.setItem('accountOfStaff',a);
}
document.getElementById('btnDelModal').onclick= function(){
    // moi ra để biết thằng nào mà còn xóa
    var accountOfStaff = localStorage.getItem('accountOfStaff');
    deleteStaff(accountOfStaff);
    closeModalAUS();
}

function closeModalAUS() {  
    overlay.classList.remove('state-show');
    frame.classList.remove('state-appear')
}
// click ra ngoài modal thì out luôn 
window.onclick = function (event) {
    if (event.target == modalAUS) {
        overlay.classList.remove('state-show');
        frame.classList.remove('state-appear');
    }
}