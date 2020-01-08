[![Build Status](https://drone.midgar.io/api/badges/Midgar/mongo/status.svg)](https://drone.midgar.io/Midgar/mongo) 
[![Coverage](https://sonar.midgar.io/api/project_badges/measure?project=Midgar%3Amongo&metric=coverage)](https://sonar.midgar.io/dashboard?id=Midgar%3Amongo)

## @midgar/mongo

Intégration de [Moogoose](https://mongoosejs.com) pour [Midgar](https://github.com/midgarjs/midgar)

## Installation

```sh
$ npm i @midgar/mongo --save
```
Si tout s'est bien passé, un message de confirmation s'affiche:

```sh
#midgar-cli
@midgar/mongo added to plugins.js !
```

## Configuration

Vous devez ajouter la confuguration suviante a votre projet avec un uri valide:

```js
 mongo: {
    default: {
      uri: 'mongodb://localhost:27017/midgar?connectTimeoutMS=1000',
    }
  }
```

Vous devez ajouter plusieur connection à la configuration:

```js
 mongo: {
    default: {
      uri: 'mongodb://localhost:27017/midgar?connectTimeoutMS=1000',
    },
    otherConnexion: {
      uri: 'mongodb://localhost:27017/otherDb?connectTimeoutMS=1000',
    }
  }
```

## Fonctionnement
Ajoute un dossier de plugin **midgar-mongo-models**: ./mongo-models/.

## Fichier model

```js
const name = 'namespace:monmodel'

export default {
  name,
  model: (mongoose) => {
    const schema = mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    })

    return mongoose.model(name, schema)
  }
}
```

Vous trouverez plus d'ingormations dans la [documentation de Mongoose](https://mongoosejs.com/docs/guide.html)

## Migration

Ce plugin ajoute un storage pour [@midgar/migrate](https://github.com/midgarjs/migrate)

### Exemple de fichier

```js
export default {
  up: async (mid, mongoService) => {
    const MonModel = mongoService.getModel('namespace:monmodel')
    const pulpFiction = new MonModel({ 
      name: 'Pulp Fiction', 
      description: 'L\'odyssée sanglante et burlesque de petits malfrats dans la jungle de Hollywoo.' 
      type: 'film'
    })

    await pulpFiction.save()
  },
  down: async (mid, mongoService) => {
    const pulpFiction = mongoService.getModel('namespace:monmodel')
    pulpFiction.deleteOne({ name: 'Pulp Fiction' })
  }
}

```