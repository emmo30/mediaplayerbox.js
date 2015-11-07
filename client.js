/*
	Media Player Box Module:
	Permet de visionné des video avec des fonctionnalités:
	Pause/Play
	Playlist
*/

var mediaplayerbox = (function($){ var _ = {
	// Settings
	settings: {
		mediaPlayerName: "mediaplayer",					//Class de la Media Player
		mediaplayerPlaylistName: "playlist",			//Class de la Playlist
		mediaplayerPlayerName: "player",				//Class de la Balise Video
		mediaplayerboxClassSelect: ".video",			//Class des lien video a traite
		DesktopSize: 737,								//Taille Minimum pour Navigateur de bureau
		ActionInterval: 1000,							//Temp pour les divers action
		MouseWheelSeach: true,							//Avance rapide avec la Molette souris
		Controler: true,								//Afficher le controleur par defauts
		IsLocalStorageActive: true,						//Active la mise en tampon des video arreter
		IsLocalSessionStorage: true,					//Idem mais efface les donne apres la fermeture de l'ongle
		SearchSpeed: 10,								//Vitesse de recherche
		IsLoop: true,									//Active la lecture en Boucle
		IsKeyControl: true,								//Active le controle par clavie
		IsMouseControl: true,							//Active le controle avec souris
		IsActiveOnMobile: false							//Active sur les navigateur Mobile
	},

	objets: {},

	/**********************/
	/* Methodes           */
	/**********************/
	/*##############################*/
	/* Creation de la mediaPlayer 	*/
	/*##############################*/
	initVideo: function(next){
		if(next)
			if(_.settings.IsLoop)
				_.objets.index = next;
			else{
				_.objets.mediaplayer.hide(1000);
				return 0;
			}

		_.initPlaylist();

		if(_.objets.index < _.objets.videos.length){
			if(_.settings.IsLocalStorageActive)
				_.SaveToLocal();
			_.objets.player[0].src = $(_.objets.videos[_.objets.index]).attr("href");
			_.objets.title.html($(_.objets.videos[_.objets.index]).html());
			if(_.objets.mediaplayer.css("display") == "none")
				_.objets.mediaplayer.show(1000);
			_.objets.player[0].play();
			if(_.settings.IsLocalStorageActive)
				_.RestoreToLocal();
		}
		else
			_.objets.mediaplayer.hide(1000);
		return false;
	},

	/*##############################*/
	/* Initialisation du module 	*/
	/*##############################*/

	init: function(){
		$(function(){
			//Initialiser tout les objets utilisable
			_.objets.window = $(window),
			_.objets.document = $(document),
			_.objets.body = $('body'),
				/********************************/
				/* Creation de la mediaPlayer 	*/
				/********************************/
				//MediaPlayer
				_.objets.mediaplayer = $("<div>").attr("class", _.settings.mediaPlayerName).hide();
				_.objets.body.append(_.objets.mediaplayer);
				//Playlist
				_.objets.playlist = $("<div>").attr("class", _.settings.mediaplayerPlaylistName);
				_.objets.mediaplayer.append(_.objets.playlist);
				//Player
				_.objets.player = $("<video>").attr({
					"class": _.settings.mediaplayerPlayerName,
					"controls": _.settings.Controler
				});
				_.objets.mediaplayer.append(_.objets.player);
				//Titre
				_.objets.title = $("<p>").attr("class", "title").html("Titre");
				_.objets.mediaplayer.append(_.objets.title);

			_.objets.videos = _.objets.body.find(_.settings.mediaplayerboxClassSelect),
			_.objets.index = 0,
			_.objets.interval = (new Date).getTime(),
			_.objets.document.on("ready", function(){
				_.objets.videos.each(function(i){
					$(this).on("click",function(){
						_.objets.index = i;
						if(_.settings.DesktopSize > _.objets.window.width()){
							if(_.settings.IsActiveOnMobile){
								_.initVideo();
								return false;
							}
						}
						else{
							_.initVideo();
							return false;
						}
					})
				}),
				_.initSize()
			});

			/************************/
			/* Key controls 		*/
			/************************/
			if(_.settings.IsKeyControl)
				_.objets.window.keydown(function(e){
					if(_.objets.mediaplayer.css("display") != "none")
						switch (e.keyCode){
							//Espace pour Play/Pause
							case 32:
								if(_.objets.player[0].paused)
									_.objets.player[0].play();
								else
									_.objets.player[0].pause();
								return false;
								break;
							//Escape pour Fermer
							case 27:
								_.objets.player[0].pause();
								if(_.settings.IsLocalStorageActive)
									_.SaveToLocal();
								_.objets.mediaplayer.hide(1000);
								return false;
								break;
							//Up pour monter le volume
							case 38:
								if(_.objets.player[0].volume<1)
									_.objets.player[0].volume += 0.1
								return false;
								break;
							//Down pour descendre le volume
							case 40:
								if(_.objets.player[0].volume>=0.1)
									_.objets.player[0].volume -= 0.1
								return false;
								break;
							//left pour video precedente
							case 37:
								if(!_.objets.previouskey){
									_.objets.interval = (new Date).getTime();
									_.objets.previouskey = 37;
								}
								_.objets.Timer = _.objets.window[0].setTimeout(function(){
									_.objets.player[0].currentTime = _.objets.player[0].currentTime - _.settings.SearchSpeed;
								},
								_.settings.ActionInterval); 
								return false;
								break;
							//Right pour video suivante
							case 39:
								if(!_.objets.previouskey){
									_.objets.interval = (new Date).getTime();
									_.objets.previouskey = 38;
								}
								_.objets.Timer = _.objets.window[0].setTimeout(function(){
									_.objets.player[0].currentTime = _.objets.player[0].currentTime + _.settings.SearchSpeed;
								},
								_.settings.ActionInterval); 
								return false;
								break;

						};
				}).keyup(function(e){
					if(_.objets.mediaplayer.css("display") != "none"){
						switch (e.keyCode){
							case 37:
								_.objets.window[0].clearTimeout(_.objets.Timer);
								if(((new Date()).getTime() - _.objets.interval)< _.settings.ActionInterval){
									if(_.objets.index - 1 >= 0){
										_.objets.index --;
										_.initVideo();
									}
									else
										if(_.settings.IsLoop)
											_.initVideo(_.objets.videos.length-1);
								}
							break;
							case 39:
								_.objets.window[0].clearTimeout(_.objets.Timer);
								if(((new Date()).getTime() - _.objets.interval)< _.settings.ActionInterval){
									if(_.objets.index +1 < _.objets.videos.length){
										_.objets.index ++;
										_.initVideo();
									}
									else
										if(_.settings.IsLoop)
											_.initVideo("0");
								}
							break;
						}
						_.objets.previouskey = null;
					}
				});

			/********************/
			/* Events 			*/
			/********************/
				/*##################*/
				/* Scroll			*/
				/*##################*/
				_.objets.window[0].addEventListener('mousewheel', function(e){
					var element = $(e.srcElement);
					if(_.objets.mediaplayer.css("display") != "none"){
						var	delta = (e.detail ? e.detail * -10 : e.wheelDelta) * 1;
						if(element.parent().attr("class") == _.objets.playlist.attr("class"))
							_.objets.playlist.scrollTop(_.objets.playlist.scrollTop()-delta);
						else
							if(_.settings.MouseWheelSeach)
								_.objets.player[0].currentTime = _.objets.player[0].currentTime - delta;
						return false;
					}
				}, false),
			_.objets.window.on("resize", function(){
				_.initSize();
			}),
			_.objets.window[0].addEventListener("beforeunload", function(e){
				if(_.settings.IsLocalStorageActive)
					_.SaveToLocal();
			}),
			_.objets.player.on("ended",function(){
				_.objets.player[0].src = "";
				_.objets.index++;
				_.initVideo(_.objets.index);
			})
			/********************/
			/* Mouse Click 		*/
			/********************/

			.on("click", function(){
				if(_.settings.IsMouseControl){
					if(((new Date()).getTime() - _.objets.interval)< _.settings.ActionInterval){
						if(_.objets.player[0].paused)
							_.objets.player[0].play();
						else
							_.objets.player[0].pause();
						_.objets.interval = (new Date()).getTime() - _.settings.ActionInterval;
					}
					else
						_.objets.interval = (new Date()).getTime();
				}
			});
		});
	},
	/*##########################################*/
	/* Methode pour La Playlist 				*/
	/*##########################################*/

	initPlaylist: function(){
		_.objets.playlist.empty(),
		_.objets.videos.each(function(i){
			text = $(this).html(),
			p = $("<p>").css({
				"color": "white",
				"padding": "5px",
				"margin-top": "0px",
				"margin-bottom": "0px",
				"font-family": "monospace",
				"font-size": "small"
			})
			.attr({
				"id": i
			})
			.html(text)
			.hover(function(){
				$(this).css({
					"background-color": "deepskyblue",
					"cursor": "pointer"
				});
				},function(){
				if(_.objets.index == i)
					$(this).css("background-color", "cornflowerblue");
				else
					$(this).css("background-color","lightcoral");
			})
			.click(function(){
				_.objets.index = Number($(this).attr("id")),
				_.initVideo($(this).attr("id"));
			});
			if(_.objets.index == i)
				p.css("background-color", "cornflowerblue");
			_.objets.playlist.append(p);
		});
	},

	/*##############################################*/
	/* Methode pour Sauvegarder La video Courante	*/
	/*##############################################*/

	SaveToLocal: function(){
		if(_.objets.player[0].src != ""){
			if(_.settings.IsLocalSessionStorage)
				_.objets.window[0].sessionStorage.setItem(_.objets.player[0].src, _.objets.player[0].currentTime);
			else
				_.objets.window[0].localStorage.setItem(_.objets.player[0].src, _.objets.player[0].currentTime);
			_.objets.player[0].src = "";
		}
	},

	/*##############################################*/
	/* Methode pour Restaurer La video Courante		*/
	/*##############################################*/

	RestoreToLocal: function(){
		if(_.settings.IsLocalSessionStorage){
			if(_.objets.window[0].sessionStorage.getItem(_.objets.player[0].src) != "null"){
				_.objets.player[0].currentTime = Number(_.objets.window[0].sessionStorage.getItem(_.objets.player[0].src));
				_.objets.window[0].sessionStorage.removeItem(_.objets.player[0].src);
			}
		}
		else
			if(_.objets.window[0].localStorage.getItem(_.objets.player[0].src) != "null"){
				_.objets.player[0].currentTime = Number(_.objets.window[0].localStorage.getItem(_.objets.player[0].src));
				_.objets.window[0].localStorage.removeItem(_.objets.player[0].src);
			}
	},

	/*##########################################*/
	/* Methode pour initialiser la taille		*/
	/*##########################################*/

	initSize: function(){
		if(_.settings.DesktopSize > _.objets.window.width()){
			_.objets.mediaplayer.css({
					"position": "absolute",
					"left": "0px",
					"top": "0px",
					"width": "100%",
					"height": "100%",
					"z-index": "200",
					"overflow": "hidden"
			}),
			_.objets.playlist.hide(),
			_.objets.player.css({
					"position": "absolute",
    				"width": "100%",
    				"height": "100%",
    				"float": "right",
    				"top": "0px",
    				"z-index": "-1",
    				"background-color": "rgba(0, 0, 0, 0.8)"
			}),
			_.objets.title.css({
					"top": "35px",
    				"margin-left": "35px",
    				"font-family": "sans-serif",
    				"color": "white"
			})
		}else{
			_.objets.mediaplayer.css({
					"position": "absolute",
					"left": "0px",
					"top": "0px",
					"width": "100%",
					"height": "100%",
					"z-index": "200",
					"overflow": "hidden"
			}),
			_.objets.playlist.css({
					"background-color": "lightcoral",
    				"width": "25%",
    				"min-width": "250px",
    				"height": "100%",
    				"float": "left",
    				"overflow-x": "hidden",
    				"overflow-y": "auto",
    				"z-index": "200"
			}).show(),
			_.objets.player.css({
					"position": "absolute",
    				"width": "75%",
    				"height": "100%",
    				"float": "right",
    				"top": "0px",
    				"z-index": "-1",
    				"background-color": "rgba(0, 0, 0, 0.8)"
			}),
			_.objets.title.css({
    				"font-family": "sans-serif",
    				"margin-left": "50%", 
    				"color": "white"
			})
		}
	}
}; return _;})(jQuery);

mediaplayerbox.init();