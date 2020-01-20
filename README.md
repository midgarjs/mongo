[![Build Status](https://drone.midgar.io/api/badges/Midgar/mongo/status.svg)](https://drone.midgar.io/Midgar/mongo) 
[![Coverage](https://sonar.midgar.io/api/project_badges/measure?project=midgar-mongo&metric=coverage)](https://sonar.midgar.io/dashboard?id=midgar-mongo)

## @midgar/mongo

Intégration de [Moogoose](https://mongoosejs.com) pour [Midgar](https://github.com/midgarjs/midgar)

## Installation

```sh
$ npm i @midgar/mongo
```
Si tout s'est bien passé, un message de confirmation s'affiche:

```sh
#midgar-cli
@midgar/mongo added to plugins.json !
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
Ce plugin ajoute un type de module **midgar-mongo-model** dans le dossier ./mongo-models/.

## Model

Voici un exemple de model:
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

Vous trouverez plus d'informations sur la structure des model mongoose dans la [documentation](https://mongoosejs.com/docs/guide.html).

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