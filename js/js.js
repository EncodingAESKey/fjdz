function Feijidazhan(){
	var box = document.querySelector(".feijidazhan");
	var box_zb = document.querySelector(".zhunbei");
	var box_yxz = document.querySelector(".youxizhong");
	var tiankong = document.querySelector(".tiankong");
	var woji = document.querySelector(".woji");
	var fs = document.querySelector(".fenshu>span:nth-child(2)");
	var timer = null;	//天空背景运动
	var timer_pao = null;//我的炮弹
	var difangfeiji = null; //敌方飞机
	var defen = 0;
	var tingzhi = document.querySelector(".tingzhi");
	var tz_defen = tingzhi.querySelectorAll("span")[1];
	var tz_btn = tingzhi.querySelectorAll("input")[0];
	// 得分
	var zongfen = function(num){
		defen += Number(num);
		fs.innerHTML = defen;
	}
	// 停止时，游戏结束时
	var stop = function(dj){
		//敌机和我机都爆炸
		dj.querySelector("img").src = dj.o.baozha;
		woji.innerHTML = "<img src='images/我的飞机爆炸.gif'>";
		//鼠标跟随事件停止
		box.onmousemove = null;
		//所有的定时器都停止
		clearInterval(timer);	// 云朵不动了
		clearInterval(timer_pao);	// 我的炮弹不动了
		clearInterval(difangfeiji);	// 敌方飞机不自动生产了
		clearInterval(dj.timer);	// 敌方飞机不动了
			
		setTimeout(function(){
			tingzhi.style.display = "block";
			tz_defen.innerHTML = fs.innerHTML;
			tz_btn.onclick = function(){
				location.reload();
			}			
		}, 1000);
	}
	// 当点击开始游戏按钮时，由准备场景切换到游戏中场景，并开始游戏
	this.play = function(){
		// 切换场景
		box_zb.style.display = "none";
		box_yxz.style.display = "block";
		// 天空、云彩背景向下运动
		var _top = -568;	//初始值
		tiankong.style.top = _top+"px";
		timer = setInterval(function(){
			var t = parseInt(tiankong.style.top)+1;
			if( t == -14 ){
				t = _top;
			}
			tiankong.style.top = t+"px";
		}, 50);
		// 我机出现 
		woji.style.left = 127+"px";
		woji.style.top = 488+"px";
		woji.style.width = 66+"px";
		woji.style.height = 80+"px";
		
		box.onmousemove = function(e){
			var x = e.clientX-box.offsetLeft;
			var y = e.clientY-box.offsetTop;
			x-=33;//鼠标位于我机中心
			y-=40;
			
			if(x<0)x=0;
			if(x>320-66)x=320-66;
			if(y<0)y=0;
			if(y>568-80)y=568-80;
					
			woji.style.left = x+"px";
			woji.style.top = y+"px";
		}
		// 我的飞机的炮弹
		//document.onkeydown = function(){
		timer_pao = setInterval(function(){
			var div = document.createElement("div");
			div.className = "paodan";
			div.style.left = parseInt(woji.style.left)+33+"px";
			div.style.top = parseInt(woji.style.top)+0+"px";
			box_yxz.appendChild(div);
			div.timer = setInterval(function(){
				var y = parseInt(this.style.top)-14;
				this.style.top = y + "px";
				if( y<= -14 ){
					clearInterval(this.timer);
					box_yxz.removeChild(this);
				}
				PengPeng();
			}.bind(div), 50);
		}, 100);
		//}
		//clearInterval(timer_pao);
		difang.play();
	}
	// 敌机
	var difang = new Diji();
	//difang.play();
	
	function Diji(){
		this.play = function(){
			
			/*this.createFeiji("da");
			this.createFeiji("zhong");
			this.createFeiji("xiao");*/
			
			this.createFeiji("xiao");
		}
		
		var n=0;
		
		this.rndCre = function(){
			
			var i = Math.floor(Math.random()*3);
			var str = ["da","zhong","xiao"][i];
			this.createFeiji(str);
			/**/
			//this.createFeiji("da");
			
		}
		
		var _this = this;
		
		difangfeiji = setInterval(function(){
			_this.rndCre();
		}, 1000);
		
		var obj = {
			"da":{
				"width":110,
				"height":164,
				"putong":"images/大飞机.png",
				"aida":"images/大飞机挨打.png",
				"baozha":"images/大飞机爆炸.gif",
				"xueliang":10,
				"yidong":[3,4,5],
				"time":300,
				"fen":1000
			},
			"zhong":{
				"width":46,
				"height":60,
				"putong":"images/中飞机.png",
				"aida":"images/中飞机挨打.png",
				"baozha":"images/中飞机爆炸.gif",
				"xueliang":6,
				"yidong":[3, 4, 5, 6, 7],
				"time":200,
				"fen":500
			},
			"xiao":{
				"width":34,
				"height":24,
				"putong":"images/小飞机.png",
				"aida":"images/小飞机挨打.png",
				"baozha":"images/小飞机爆炸.gif",
				"xueliang":1,
				"yidong":[5, 6, 7, 8, 9, 10],
				"time":100,
				"fen":100
			}
		};
		
		this.createFeiji = function(key){
			var o = obj[key];
			//console.log(o.yidong);
			var x = Math.random()*(320-o.width);	// 随机出现的x轴位置
			var oy = o.yidong;
			var oyl = oy.length;
			var speed = oy[Math.floor(oyl*Math.random())]; // 该飞机的速度
			
			// 根据key值，创建飞机
			var div = document.createElement("div");
			box_yxz.appendChild(div);
			div.className = "diji";
			div.style.cssText = "width:"+o.width+"px; height:"+o.height+"px; left:"+x+"px;";
			div.style.top = -(o.height)+"px"			
			//div.src = o.putong;
			//div.o = o;
			
			div.o = {};
			for( var a in o ){
				div.o[a] = o[a];
			}
			
			div.o.speed = speed;	// 当前速度
			div.o.hp = o.xueliang;	// 当前血量
			
			var img = document.createElement("img");
			div.appendChild(img);
			img.src = o.putong;
			
			var div_hp = document.createElement("div");
			div.appendChild(div_hp);
			div_hp.innerHTML = o.xueliang;
			
			var div_name = document.createElement("div");
			div.appendChild(div_name);
			div_name.innerHTML = ++n;
			div_name.style.top = "20px";
			
			
			// 飞机动起来	
			//clearInterval(div.timer);
			div.timer = setInterval(function(){
				
				
				var _this = this;
				_this.title = _this.o.speed;
				var t = parseInt(_this.style.top) + _this.o.speed;
				_this.style.top = t+"px";
				if( t>=568 ){
					clearInterval(_this.timer);
					box_yxz.removeChild(_this);
				}
				
				ZhuangZhuang();
				
			}.bind(div), 50);
			
		}
	}
	
	// 检测敌机是否撞到了本机上
	function ZhuangZhuang(){
		if( tingzhi.style.display == "block" ){
			return;
		}
		var arrDiji = document.querySelectorAll(".diji");
		var arrDijiLength = arrDiji.length;
		//document.title = arrDijiLength
		for( var j=0; j<arrDijiLength; j++ ){
			// 敌机
			var diji = arrDiji[j];
			var dl = parseInt(diji.style.left);
			var dt = parseInt(diji.style.top);
			var dw = parseInt(diji.style.width);
			var dh = parseInt(diji.style.height);
			// 我机	
			var wl = parseInt(woji.style.left);
			var wt = parseInt(woji.style.top);
			var ww = parseInt(woji.style.width);
			var wh = parseInt(woji.style.height);
			// 碰撞时，游戏结束
			//document.title = (dl+dw > wl) +" | "+ (dl < wl+ww) + " | " + dl+","+ wl+"," + ww
			if( dl+dw > wl && dl < wl+ww  &&  dt+dh > wt && dt < wt+wh ){
				stop(diji);
			}
		}
	}
	
	// 检测炮弹是否撞到了敌机上，如果撞到了敌机上，敌机血量下降
	function PengPeng(){
		var arrPaodan = document.querySelectorAll(".paodan");
		var arrPaodanLength = arrPaodan.length;
		var arrDiji = document.querySelectorAll(".diji");
		var arrDijiLength = arrDiji.length;
		for( var i=0; i<arrPaodanLength; i++ ){
			var paodan = arrPaodan[i];
			for( var j=0; j<arrDijiLength; j++ ){
				var diji = arrDiji[j];
				// 判断炮弹和敌机是否发生碰撞
				var pl = parseInt(paodan.style.left);
				var pt = parseInt(paodan.style.top);
				var pw = 6;
				var ph = 14;
				
				var dl = parseInt(diji.style.left);
				var dt = parseInt(diji.style.top);
				var dw = parseInt(diji.style.width);
				var dh = parseInt(diji.style.height);
				
				// 如果炮弹在敌机上
				if( pl+pw > dl && pl-pw < dl+dw  &&  pt < dt+dh && pt+ph > dt  ){
					
					// 删除炮弹
					clearInterval(paodan.timer);
					box_yxz.removeChild(paodan);
					// 敌机是否已亡
					if( diji.gameover!=1 ){
						// 敌机减少血量
						
						diji.o.hp = diji.o.hp-1;
						//diji.src = diji.o.aida;
						diji.querySelector("img").src = diji.o.aida;
						var ad = diji.querySelectorAll("div")
						ad[0].innerHTML = diji.o.hp;
						//document.title = ad[1].innerHTML+":"+diji.o.hp+"/"+diji.o.xueliang;
						
						if( diji.o.hp <= 0 ){
							// 删除敌机
							zongfen(diji.o.fen);
							
							diji.gameover = 1;
							clearInterval(diji.timer);
							//diji.src = diji.o.baozha;
							diji.querySelector("img").src = diji.o.baozha;
							
							setTimeout(function(){
								box_yxz.removeChild(this);
								
							}.bind(diji), diji.o.time);
							
							//difang.rndCre();
							
						}
						
					}
					
					return;
				}
			}	
		}
	}
	
}
