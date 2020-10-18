const kortObj = {
      widthKort : 800,
      heightKort : 400,
    };  
    const ballObj = {
      speedBallX : null,
      speedBallY : null,
      widthBall : 16,
      heightBall : 16,
      accel : 1.01,  //ускорение
      posX : kortObj.widthKort / 2 - this.widthBall / 2,
      posY : kortObj.heightKort / 2 - this.heightBall / 2,
      positionBall : function(){
        let ball = document.getElementById("ball");

        ball.style.left = this.posX + "px";
        ball.style.top = this.posY + "px";
      }
    };
    const leftRocketObj = {
      heightLeftRocket : kortObj.heightKort * 0.2,
    };
    const rightRocketObj = {
      heightRightRocket : kortObj.heightKort * 0.2,
    };
    const counterMax = 5; // играем до 5 очков

    // стартовое размещение всех элементов на поле
    getStartPosition();
    function getStartPosition(){
      let kort = document.getElementById("kort");
      kort.style.width = kortObj.widthKort + "px";
      kort.style.height = kortObj.heightKort + "px";
      
      ballObj.posX = kortObj.widthKort / 2 - 16 / 2,
      ballObj.posY = kortObj.heightKort / 2 - 16 / 2,
      ballObj.speedBallX = 3*Math.random()+2; //рандомно кооректируем углы старта мяча (плюсуем 2 - что бы угол был более острым)
      ballObj.speedBallY = 3*Math.random()+1;
      ballObj.positionBall();

      let ball = document.getElementById("ball");
      ball.style.width = ballObj.widthBall + "px";
      ball.style.height = ballObj.heightBall + "px";

      let leftRocket = document.getElementById("leftRocket");
      leftRocket.style.height = leftRocketObj.heightLeftRocket + "px";
      leftRocket.style.top = leftRocketObj.heightLeftRocket+"px";

      let rightRocket = document.getElementById("rightRocket");
      rightRocket.style.height = rightRocketObj.heightRightRocket + "px";
      rightRocket.style.top = rightRocketObj.heightRightRocket +"px";

      let count = document.getElementById("count");
      count.style.color = "black";
      count.style.fontSize = "100px";
      
    }
   
    // управление ракетками
    (function getControlRockets(){    
      let left = document.getElementById("leftRocket");
      let right = document.getElementById("rightRocket");
      let speed = 10;
      let a = null;
      let b = null;
   
      document.addEventListener("keydown", function(event){
        event.preventDefault();
        if(event.code == "ControlLeft" && !event.repeat){
          requestAnimationFrame(goDownLeft);
        }
        if(event.code == "ShiftLeft" && !event.repeat){
          requestAnimationFrame(goUpLeft);
        }
        if(event.code == "ArrowDown" && !event.repeat){
          requestAnimationFrame(goDownRight);
        }
        if(event.code == "ArrowUp" && !event.repeat){
          requestAnimationFrame(goUpRight);
        }
      })   
    
      document.addEventListener("keyup", function(event){
        event.preventDefault();
        if(event.code == "ControlLeft"){
          cancelAnimationFrame(a);
        }
        if(event.code == "ShiftLeft"){
          cancelAnimationFrame(a);
        }
        if(event.code == "ArrowDown"){
          cancelAnimationFrame(b);
        }
        if(event.code == "ArrowUp"){
          cancelAnimationFrame(b);
        }
      })  

      function goDownLeft(){
        let posLeft = parseFloat(getComputedStyle(left).top);
        if(posLeft < kortObj.heightKort - leftRocketObj.heightLeftRocket){
          posLeft += speed;
          left.style.top = posLeft + "px";
          a = requestAnimationFrame(goDownLeft);
        }
      }  

      function goUpLeft(){
        let posLeft = parseFloat(getComputedStyle(left).top);
        if(posLeft > 0){
          posLeft -= speed;
          left.style.top = posLeft + "px";
          a = requestAnimationFrame(goUpLeft);
        }
      }  

      function goDownRight(){
        let posRight = parseFloat(getComputedStyle(right).top);
        if(posRight < kortObj.heightKort - rightRocketObj.heightRightRocket){
          posRight += speed;
          right.style.top = posRight + "px";
          b = requestAnimationFrame(goDownRight);
        }
      }  

      function goUpRight(){
        let posRight = parseFloat(getComputedStyle(right).top);
        if(posRight > 0){
          posRight -= speed;
          right.style.top = posRight + "px";
          b = requestAnimationFrame(goUpRight);
        }
      }
    })();
  
    // счетчик очков
    let leftPoint = 0;
    function leftPoints(){
        leftPoint++;
        let p = document.getElementById("leftScore");
        p.innerHTML = leftPoint;
    }
    let rightPoint = 0;
    function rightPoints(){
        rightPoint++;
        let p = document.getElementById("rightScore");
        p.innerHTML = rightPoint;
    }

    // кнопка запуска игры
    let vectorX = 1;
    let vectorY = -1;
    (function pressButtonStartGame(){
      let start = document.getElementById("start");

      start.addEventListener("click", getStartGame);

      function getStartGame(){
        leftPoint = -1;
        leftPoints();

        rightPoint = -1;
        rightPoints();

        vectorX = -vectorX;
        vectorY = -vectorY;
        startCounter();
        start.disabled = true;    
      }
    })();
   
    // запуск игры после забитого гола
    function getNextStart(){
        getStartPosition();
        //задаем начальный вектор движения шара
        vectorX = -vectorX;
        vectorY = -vectorY;
        startCounter();
    }
   
    //начало отсчета и старт игры
    function startCounter(){    
      getCountStyle();
      setTimeout(function(){
        count.innerHTML = "2";
        setTimeout(function(){
          count.innerHTML = "1";
          setTimeout(function(){
            getFightStyle();
            setTimeout(function(){
              count.style.visibility = "hidden";  
              requestAnimationFrame(getMoveBall);
            },500); 
          },1000);
        },1000);
      },1000);
    }    
   
    //движение шарика
    function getMoveBall(){
      let leftRocket = document.getElementById("leftRocket");
      let rightRocket = document.getElementById("rightRocket");
      let leftRocketY = parseFloat(getComputedStyle(leftRocket).top);
      let rightRocketY = parseFloat(getComputedStyle(rightRocket).top);
      let rightRocketW = parseFloat(getComputedStyle(rightRocket).width);
      let leftRocketW = parseFloat(getComputedStyle(leftRocket).width);

      ballObj.posX += ballObj.speedBallX * vectorX;
      ballObj.posY += ballObj.speedBallY * vectorY;
        
      // вылетел ли мяч правее стены?
      if(ballObj.posX + ballObj.widthBall > kortObj.widthKort - rightRocketW){
        if(ballObj.posY + ballObj.heightBall / 2 >= rightRocketY && ballObj.posY + ballObj.heightBall / 2 <= rightRocketY + rightRocketObj.heightRightRocket){
          ballObj.speedBallX = -ballObj.speedBallX * ballObj.accel;
          ballObj.posX = (kortObj.widthKort-rightRocketW) - ballObj.widthBall;  
        }else{
          ballObj.speedBallX = 0;
          ballObj.speedBallY = 0;
          ballObj.posX = kortObj.widthKort - ballObj.widthBall;  
          ballObj.positionBall();
          leftPoints();
          if(leftPoint < counterMax){
            getGolStyle();
            setTimeout(getNextStart, 1000);
            return;
          }else{
            getStartPosition();
            getWinnerStyleLeft();
            start.disabled = false;
            return;
          }
        }
      }
      // вылетел ли мяч левее стены?
      if(ballObj.posX < leftRocketW){
        if(ballObj.posY + ballObj.heightBall / 2 >= leftRocketY && ballObj.posY + ballObj.heightBall / 2 <= leftRocketY + leftRocketObj.heightLeftRocket){
          ballObj.speedBallX = -ballObj.speedBallX * ballObj.accel;
          ballObj.posX = leftRocketW;
        }else{
          ballObj.speedBallX = 0;
          ballObj.speedBallY = 0;
          ballObj.posX = 0; 
          ballObj.positionBall();
          rightPoints();
          if(rightPoint < counterMax){
            getGolStyle();
            setTimeout(getNextStart, 1000);
            return;
          }else{
            getStartPosition();
            getWinnerStyleRight();
            start.disabled = false;
            return;
          } 
        }
      }
      // вылетел ли мяч ниже пола?
      if(ballObj.posY + ballObj.heightBall > kortObj.heightKort){
        ballObj.speedBallY = -ballObj.speedBallY * ballObj.accel;
        ballObj.posY = kortObj.heightKort - ballObj.heightBall;  
      }
      // вылетел ли мяч выше потолка?
      if(ballObj.posY < 0){
        ballObj.speedBallY = -ballObj.speedBallY * ballObj.accel;
        ballObj.posY = 0;
      }

      ballObj.positionBall();
      requestAnimationFrame(getMoveBall);
    }

    //оформляем оповещение, когда забивают ГОЛ
    function getGolStyle(){
      let count = document.getElementById("count");
      count.innerHTML = "G O L";
      let wH2 = parseFloat(getComputedStyle(count).width);
      count.style.left = (kortObj.widthKort / 2) - wH2 / 2 + "px";
      count.style.color = "black";
      count.style.textAlign = "center";
      count.style.fontSize = "100px";
      count.style.visibility = "visible";    
    }
   
    //оформляем оповещение, FIGHT
    function getFightStyle(){
      let count = document.getElementById("count");  
      count.innerHTML = "FIGHT";
      let wH2 = parseFloat(getComputedStyle(count).width);
      count.style.left = (kortObj.widthKort / 2) - wH2 / 2 + "px";
      count.style.color = "red";
      count.style.fontSize = "100px";
    }

    //оформляем оповещение, WINNER левый игрок
    function getWinnerStyleLeft(){
      let count = document.getElementById("count");  
      count.innerHTML = "WINNER LEFT";
      let wH2 = parseFloat(getComputedStyle(count).width);
      count.style.left = (kortObj.widthKort / 2) - wH2 / 2 + "px";
      count.style.color = "red";
      count.style.fontSize = "75px";
      count.style.visibility = "visible";  
    }
    
    //оформляем оповещение, WINNER правый игрок
    function getWinnerStyleRight(){
      let count = document.getElementById("count");  
      count.innerHTML = "WINNER RIGHT";
      let wH2 = parseFloat(getComputedStyle(count).width);
      count.style.left = (kortObj.widthKort / 2) - wH2 / 2 + "px";
      count.style.color = "red";
      count.style.fontSize = "75px";
      count.style.visibility = "visible";  
    }

    //оформляем обратный отсчет
    function getCountStyle(){
      let count = document.getElementById("count");
      count.style.visibility = "visible";
      count.innerHTML = "3";
      let wH2 = parseFloat(getComputedStyle(count).width);
      count.style.left = (kortObj.widthKort / 2) - wH2 / 2 + "px";
      count.style.color = "black";
      count.style.textAlign = "center";
      count.style.fontSize = "100px";
    }
