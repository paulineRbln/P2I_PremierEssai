# README - Installation et Exécution de l'Application TKTech

Ce projet se compose de deux parties :  
1. **`tktech_app`** : L'application **React** (front-end).
2. **`tktech_bdd`** : L'API **backend** utilisant **Entity Framework Core**.

Ces deux parties doivent être exécutées sur des serveurs locaux différents.

---

### Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- **Node.js** (version 14.x ou supérieure) pour l'application React.
- **.NET SDK** (version 6.x ou supérieure) pour l'API backend (Entity Framework Core).
- **SQL Server** ou une autre base de données compatible avec Entity Framework Core (si nécessaire).

---

### Étapes d'Installation

#### 1. Cloner le Dépôt

Clonez le dépôt du projet sur votre machine locale :

**git clone https://<url-du-depot>.git**


#### 2. Installer et Configurer le Backend (API)
**cd BACKEND/tktech_bdd**
**dotnet ef database update**
**dotnet run**

#### 3. Installer et Configurer le Frontend (React) 
Rendez vous dans la racine du dépot (tktech_app)
**npm install**
**npm start**