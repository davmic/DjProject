Pour lancer le site web :
Il faut tout d'abord se placer sous le repertoire du projet (avec la console)
Avoir les modules express et less de nodeJs installés sous le repertoire du projet (npm install express et npm install less)
Puis lancer la commande : node server.js
Un message s'affichera sur la console  "Serveur connecté! localhost : 8082"
Lancer Google Chrome et taper l'URL suivante : http://localhost:8082/ (API Web Audio non entièrement compatible avec Mozilla, utiliser de préférence Chrome).
Ainsi le projet web est accessible et fonctionnel 
Pour charger une musique il suffit d'appuyer sur le bouton Upload, la musique met un certain temps à être chargée
La première musique de la PlayList1 se lance automatiquement une fois chargée.
Pour savoir quand une musique est chargée et donc jouable, il suffit d'attendre que les informations : 
Bpm, Time, Size et format soient affichées à coté de la chanson, tant que les informations ne sont pas affichées, la musique n'est pas jouable.
Il y a deux PlayLists a disposition, il est conseillé de charger au moins une musique dans les 2 PlayLists afin de pouvoir tester correctement le projet. 


David Micallef, David Boccara, Melissa Begyn, Sebastien Wallart, Luc Elsaesser