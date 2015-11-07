# Mediaplayerbox

Cet outil permet de créer un mediaplayer avec la liste de vidéo présent dans le contenu
de votre site web.

# Sommaire

* [Utilisation](#utilisation)
* [Paramètre](#option)

<a name="utilisation">
## Utilisation

1. Telecharger *client.js*.
2. importer la librairie.
```
<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script type="text/javascript" src="./client.js"></script>
</head>
<body>
</body>
</html>

```
3. Inserer vos videos dans le contenu
```
<body>
	<a href="./lien_vers_la_video_1.mp4" class=".video">Ma video 1</a>
	<a href="./lien_vers_la_video_2.mp4" class=".video">Ma video 2</a>
</body>
```
4. Et le tour est joué.

<a name="option">
## Paramètre
```
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
```