Avant de commencer, vous devez vous assurer que vous avez installé les suivants :

Node.js (version minimale : 14.x)
npm (version minimale : 6.x)

Installation
Cloner le dépôt GitHub en utilisant la commande suivante :
shell
git clone https://github.com/abdenacer1993/RoomMeetingReservation.git

Accédez au répertoire du projet :
shell
cd RoomMeetingReservation
Installez les dépendances du projet en utilisant la commande suivante :
shell
npm install

apres
shell
cd backend
faire npm install
apres 
shell
cd.. 
cd fontend 
npm install

Configurez les variables d'environnement dans le fichier .env (un modèle est fourni).
SECRET_KEY=taper secret key  
MONGOATLAS_URI= dongo atlas et le nom de la base salleDB


Exécutez le serveur de développement en utilisant la commande suivante :
shell
cd ..
npm run dev 
Utilisation
Ouvrez votre navigateur et accédez à http://localhost:3000 pour voir l'application en cours d'exécution.

Vous pouvez également créer un compte en utilisant les formulaires de connexion.
Une fois connecté, vous pouvez voir la liste des salles disponibles et réserver une salle.
