// Lấy tất cả các phần tử ".wrapper"
const wrappers = document.querySelectorAll(".wrapper");

wrappers.forEach(wrapper => {
    const Horizon = wrapper.querySelector(".Horizon");
    const firstImg = Horizon.querySelectorAll("img")[0];
    const arrowIcons = wrapper.querySelectorAll("i");

    let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;

    const showHideIcons = () => {
        // Hiển thị hoặc ẩn các biểu tượng prev/next tùy thuộc vào giá trị cuộn trái của Horizon
        let scrollWidth = Horizon.scrollWidth - Horizon.clientWidth; // lấy chiều rộng cuộn tối đa
        arrowIcons[0].style.display = Horizon.scrollLeft == 0 ? "none" : "block";
        arrowIcons[1].style.display = Horizon.scrollLeft == scrollWidth ? "none" : "block";
    }

    arrowIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            let firstImgWidth = firstImg.clientWidth + 14; // lấy chiều rộng của hình ảnh đầu tiên và thêm 14 giá trị lề
            // Nếu biểu tượng được nhấn là "left", giảm giá trị chiều rộng từ cuộn trái của Horizon, ngược lại thì thêm vào
            let increment = icon.id == "left" || icon.id == "left1" ? -firstImgWidth : firstImgWidth;
            Horizon.scrollLeft += increment;
            setTimeout(() => showHideIcons(), 60); // gọi hàm showHideIcons sau 60ms
        });
    });

    const autoHorizon = () => {
        // Nếu không có hình ảnh nào còn lại để cuộn thì trả về từ đây
        if (Horizon.scrollLeft - (Horizon.scrollWidth - Horizon.clientWidth) > -1 || Horizon.scrollLeft <= 0) return;

        positionDiff = Math.abs(positionDiff); // làm cho giá trị positionDiff trở thành dương
        let firstImgWidth = firstImg.clientWidth + 14;
        // Lấy giá trị khác biệt cần thêm hoặc giảm từ trái của Horizon để lấy trung tâm hình ảnh giữa
        let valDifference = firstImgWidth - positionDiff;

        if (Horizon.scrollLeft > prevScrollLeft) { // nếu người dùng đang cuộn sang phải
            return Horizon.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
        }
        // nếu người dùng đang cuộn sang trái
        Horizon.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
    }

    const dragStart = (e) => {
        // cập nhật giá trị biến toàn cục khi sự kiện chuột xuống
        isDragStart = true;
        prevPageX = e.pageX || e.touches[0].pageX;
        prevScrollLeft = Horizon.scrollLeft;
    }

    const dragging = (e) => {
        // cuộn hình ảnh/Horizon sang trái tùy theo con trỏ chuột
        if (!isDragStart) return;
        e.preventDefault();
        isDragging = true;
        Horizon.classList.add("dragging");
        positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
        Horizon.scrollLeft = prevScrollLeft - positionDiff;
        showHideIcons();
    }

    const dragStop = () => {
        isDragStart = false;
        Horizon.classList.remove("dragging");

        if (!isDragging) return;
        isDragging = false;
        autoHorizon();
    }

    Horizon.addEventListener("mousedown", dragStart);
    Horizon.addEventListener("touchstart", dragStart);

    document.addEventListener("mousemove", dragging);
    Horizon.addEventListener("touchmove", dragging);

    document.addEventListener("mouseup", dragStop);
    Horizon.addEventListener("touchend", dragStop);
});
const wrapper = document.querySelector(".wrapper");
const Horizon = wrapper.querySelector(".Horizon");
const cards = Horizon.querySelectorAll(".card");
const leftButton = wrapper.querySelector("#left1");
const rightButton = wrapper.querySelector("#right1");


 
var swiper = new Swiper(".slide-content", {
    slidesPerView: 3,
    spaceBetween: 25,
    loop: true,
    centerSlide: 'true',
    fade: 'true',
    grabCursor: 'true',
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints:{
        0: {
            slidesPerView: 1,
        },
        520: {
            slidesPerView: 2,
        },
        950: {
            slidesPerView: 3,
        },
    },
  });

  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 6,
    spaceBetween: 10,
    loop: true,
    loopAdditionalSlides: 1, 
    autoplay: {
        delay: 1, 
        disableOnInteraction: false,
    },
    speed: 2000,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 6, 
        },
    },
});



  
