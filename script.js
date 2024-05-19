const descriptionSectionEl = document.getElementById(
    "description-section"
  );
  const startButtonEl = document.getElementById("startButton");
  const downloadButtonEl = document.getElementById("downloadButton");

  const videoElement = document.getElementById("videoElement");
  const photoCaptureSectionEl = document.getElementById(
    "photo-capture-section"
  );
  const photoChoiceSectionEl = document.getElementById(
    "photo-choice-section"
  );
  const photoOutputSectionEl = document.getElementById(
    "photo-output-section"
  );
  const captureButton = document.getElementById("captureButton");
  const photoList = document.getElementById("photoList");
  const selectPhotoList = document.getElementById("selectPhotoList");
  const remainingCountElement = document.getElementById("remainingCount");
  const countdownTimer = document.getElementById("countdownTimer");
  const selectCompleteButtonEl = document.getElementById(
    "selectCompleteButton"
  );

  const frameHoles = document.querySelectorAll(".frame-hole");
  const frameArr = [
    // {
    //   imgSrc : "frame/인대프레임1.png",
    //   name : "1",
    //   logoSrc : "frame/인대로고1.png"
    // },
    // {
    //   imgSrc : "frame/인대프레임2.png",
    //   name : "2",
    //   logoSrc : "frame/인대로고2.png"
    // },
    // {
    //   imgSrc : "frame/인대프레임3.png",
    //   name : "3",
    //   logoSrc : "frame/인대로고3.png"
    // },
    // {
    //   imgSrc : "frame/사록픽.png",
    //   name : "사록픽",
    // },
    {
      imgSrc : "frame/조리1반.png",
      name : "조리1",
    },
    {
      imgSrc : "frame/조리2반.png",
      name : "조리2",
    },
    {
      imgSrc : "frame/그린1반.png",
      name : "그린1",
    },
    {
      imgSrc : "frame/그린2반.png",
      name : "그린2",
    },
    {
      imgSrc : "frame/경영1반.png",
      name : "경영1",
    },
    {
      imgSrc : "frame/경영2반.png",
      name : "경영2",
    },
  ];

  const photoArr = []; // 촬영한 이미지 배열
  const selectedPhotoArr = []; // 선택된 이미지 배열

  const maxCount = 6; // 최대 촬영 횟수
  let remainingCount = maxCount; // 현재 남은 촬영 횟수

  const countdownDuration = 10; // 카운트다운 기간 (초)
  let countdownIntervalId; // 카운트다운 인터벌 ID
  let countdownTime = countdownDuration; // 현재 카운트다운 시간

  // 남은 촬영 횟수 update
  function updateRemainingCount() {
    remainingCountElement.innerHTML = `남은 사진 촬영 횟수: ${remainingCount}회`;
  }

  // 10초 카운트 다운
  function startCountdown() {
    countdownTime = countdownDuration;
    countdownTimer.textContent = countdownTime;
    playAudio();

    countdownIntervalId = setInterval(() => {
      countdownTime--;
      countdownTimer.textContent = countdownTime;

      if (countdownTime <= 0) {
        clearInterval(countdownIntervalId);
        capturePhoto();
      }
    }, 1000);
  }

  const audio = new Audio("voice/jammin-countdown.mp3");

  function playAudio() {
    if (audio.paused) {
      audio.play();
    } else {
      audio.currentTime = 0; // 현재 위치를 처음으로 설정
      audio.play();
    }
  }

  function stopAudio() {
    audio.pause();
    audio.currentTime = 0; // 현재 위치를 처음으로 설정
  }

  // 사진 촬영
  function capturePhoto() {
    clearInterval(countdownIntervalId); // 카운트다운 중지

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.width;
    canvas.height = videoElement.height;
    const context = canvas.getContext("2d");
    context.scale(-1, 1); // 이미지 좌우 반전 처리
    context.drawImage(
      videoElement,
      -canvas.width,
      0,
      canvas.width,
      canvas.height
    );

    // 개별 이미지 다운로드
    // const link = document.createElement("a");
    // link.href = canvas.toDataURL();
    // link.download = "captured_image.png";
    // link.click();

    // 촬영한 이미지를 배열에 추가
    photoArr.push(canvas.toDataURL());

    // 이미지를 목록에 표시
    const listItem = document.createElement("li");
    const image = document.createElement("img");
    image.style.width = "240px";
    image.style.height = "180px";
    image.src = canvas.toDataURL();
    listItem.appendChild(image);
    photoList.appendChild(listItem);

    // 남은 사진 촬영 횟수 갱신
    remainingCount--;
    updateRemainingCount();

    // 사진 촬영 횟수가 남아있을 경우 카운트다운 재시작
    if (remainingCount > 0) {
      startCountdown();
    } else {
      captureButton.disabled = true; // 사진 촬영 버튼 비활성화
      stopAudio();
      choicePhoto();
    }
  }

  const selectPhotoItems = Array.from(
    selectPhotoList.querySelectorAll("li")
  );

  // selectedPhotoArr를 virtual frame에 넣기
  function inputVirtualFrame() {
    selectPhotoItems.forEach((item, index) => {
      item.innerHTML = "";

      const imageSrc = selectedPhotoArr[index];
      if (imageSrc) {
        const image = document.createElement("img");
        image.src = imageSrc;
        image.alt = `Selected Image ${index + 1}`;

        item.appendChild(image);
      }
    });
  }

  // selectedPhotoArr를 frame에 넣기
  function inputPhotoFrame() {
    frameHoles.forEach((hole, index) => {
      if (index >= selectedPhotoArr.length * 2) {
        hole.innerHTML = "";

        return false;
      }

      const imageSrc = selectedPhotoArr[index % selectedPhotoArr.length];
      if (imageSrc) {
        const image = document.createElement("img");
        image.src = imageSrc;
        image.alt = `Selected Image ${index + 1}`;
        image.classList.add("selected-image");
        hole.appendChild(image);
      }
    });
  }

  // 사진 몇개 골랐는지 체크 -> 버튼 활성화 관리
  function checkSelectedPhoto() {
    if (selectedPhotoArr.length !== 4) {
      selectCompleteButtonEl.setAttribute("disabled", true);
    } else {
      selectCompleteButtonEl.removeAttribute("disabled");
    }
  }

  const selectFrameSectionEl = document.getElementById(
    "select-frame-section"
  );

  const frameImg1 = document.querySelector('#frame-img1');
  const frameImg2 = document.querySelector('#frame-img2');

  // 4장 다 고르면 프레임 고르는 섹션으로 넘어가기
  function choiceFrame() {
    // 화면 전환
    photoChoiceSectionEl.classList.toggle("visibility-hidden");
    photoOutputSectionEl.classList.toggle("visibility-hidden");

    // 프레임 carousel item div 생성
    frameArr.forEach((frame, index) => {
      const divTag = document.createElement("div");
      divTag.classList.add("select-frame-item");
      divTag.id = `frameImg${index}`;
      
      divTag.addEventListener('click', () => {
        frameImg1.src = frameArr[index].imgSrc;
        frameImg2.src = frameArr[index].imgSrc;
      })

      // 로고 src가 없다면
      if(!frameArr[index].logoSrc) {
        const textTag = document.createElement('div');
        textTag.classList.add('select-frame-item-name');
        textTag.innerHTML = frameArr[index].name;
        divTag.appendChild(textTag);
      } else {
        divTag.style.backgroundImage = `url('${frameArr[index].logoSrc}')`;
        divTag.style.backgroundSize = 'contain';
      }

      selectFrameSectionEl.appendChild(divTag);
    });
  }

  selectCompleteButtonEl.addEventListener("click", () => {
    choiceFrame();
  });

  // 사진 고르기 기능
  function choicePhoto() {
    photoCaptureSectionEl.classList.toggle("visibility-hidden"); // 웹캠 가리기
    photoChoiceSectionEl.classList.toggle("visibility-hidden"); // 사진 리스트 보여주기

    const photoArrItems = Array.from(
      photoList.querySelectorAll("#photoList > li")
    );

    // 고른 사진 배열에 넣기
    for (let i = 0; i < photoArrItems.length; i++) {
      const photoItem = photoArrItems[i];

      photoItem.addEventListener("click", function () {
        if (photoItem.classList.contains("selected")) {
          photoItem.classList.remove("selected");
          const imgSrc = photoItem.querySelector("img").src;
          const index = selectedPhotoArr.indexOf(imgSrc);
          if (index > -1) {
            selectedPhotoArr.splice(index, 1);
          }
        } else {
          if (selectedPhotoArr.length >= 4) {
            return; // 최대 4개의 사진을 선택했다면 더이상 선택하지 못함
          }
          photoItem.classList.add("selected");
          const imgSrc = photoItem.querySelector("img").src;
          selectedPhotoArr.push(imgSrc);
        }

        checkSelectedPhoto();
        inputPhotoFrame();
        inputVirtualFrame();
      });
    }
  }

  // 완성된 사진 다운로드
  function downloadImage() {
    // HTML 요소를 캡처하여 캔버스에 그림
    const element = document.getElementById("memorism-photo");
    html2canvas(element, { scale: 2 }).then(function (canvas) {
      // 캔버스를 이미지 데이터 URL로 변환합니다.
      const image = canvas.toDataURL("image/png");

      // 가상 링크를 생성하여 이미지 다운로드를 트리거
      const link = document.createElement("a");
      link.href = image;
      link.download = "memorism.png";
      link.click();
    });
  }

  downloadButtonEl.addEventListener("click", downloadImage);

  // 사진 촬영 시작
  function initialize() {
    descriptionSectionEl.classList.toggle("visibility-hidden");
    photoCaptureSectionEl.classList.toggle("visibility-hidden");

    remainingCount = maxCount;
    updateRemainingCount();

    if (remainingCount > 0) {
      startCountdown();
    } else {
      captureButton.disabled = true; // 사진 촬영 버튼 비활성화
    }
  }

  // OpenCV.js 로드 후 실행될 함수
  function onOpenCvReady() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
        videoElement.play();
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });

    captureButton.addEventListener("click", () => {
      capturePhoto();
    });
  }

  startButtonEl.addEventListener("click", initialize);